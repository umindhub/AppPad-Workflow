// PR check. Compares two checkouts (base branch vs. PR head) and runs with the BASE
// branch's copy of this script, so a PR can't weaken the rules it is checked against.
//
//   node scripts/check.mjs --base <dir> --head <dir> --author <github-login>
//   node scripts/check.mjs --head .            (local: validate only)
//
// Writes a Markdown review summary to $GITHUB_STEP_SUMMARY when set.

import { appendFileSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import {
    RESERVED_PREFIXES, compareVersions, isAdmin, isMaintainer, listWorkflowDirs, loadFolder,
    permissionList, sha256, stepKinds,
} from "./lib.mjs"

const args = Object.fromEntries(
    process.argv.slice(2).reduce((pairs, arg, i, all) => {
        if (arg.startsWith("--")) pairs.push([arg.slice(2), all[i + 1]])
        return pairs
    }, []),
)
const head = path.resolve(args.head ?? ".")
const base = args.base ? path.resolve(args.base) : null
const author = args.author ?? ""

const errors = []
const summary = []

// ── Files outside workflows/ ─────────────────────────────────────────────────

const SKIP_DIRS = new Set([".git", "node_modules", "dist", "workflows"])

function treeHashes(root, rel = "") {
    const out = new Map()
    for (const name of readdirSync(path.join(root, rel))) {
        const relPath = path.join(rel, name)
        const full = path.join(root, relPath)
        if (statSync(full).isDirectory()) {
            if (rel === "" && SKIP_DIRS.has(name)) continue
            for (const [k, v] of treeHashes(root, relPath)) out.set(k, v)
        } else {
            out.set(relPath, sha256(readFileSync(full)))
        }
    }
    return out
}

if (base && !isAdmin(author)) {
    const a = treeHashes(base)
    const b = treeHashes(head)
    const changed = [...new Set([...a.keys(), ...b.keys()])].filter((k) => a.get(k) !== b.get(k)).sort()
    for (const file of changed) {
        errors.push(`${file}: only workflow folders (workflows/<id>/) can be changed in a submission`)
    }
}

// ── Workflow folders ─────────────────────────────────────────────────────────

const folderHash = (dir) =>
    existsSync(dir)
        ? readdirSync(dir).sort().map((n) => `${n}:${sha256(readFileSync(path.join(dir, n)))}`).join("|")
        : ""

const fileHash = (dir, name) => (existsSync(path.join(dir, name)) ? sha256(readFileSync(path.join(dir, name))) : "")

const headIds = listWorkflowDirs(head)
const baseIds = base ? listWorkflowDirs(base) : []
const allIds = [...new Set([...headIds, ...baseIds])].sort()

for (const id of allIds) {
    const inHead = headIds.includes(id)
    const inBase = baseIds.includes(id)
    const headDir = path.join(head, "workflows", id)
    const baseDir = base ? path.join(base, "workflows", id) : null

    const now = inHead ? loadFolder(head, id) : null
    const before = inBase ? loadFolder(base, id) : null
    const changed = !base || folderHash(headDir) !== folderHash(baseDir)
    if (now) errors.push(...now.errors.map((e) => `${id}: ${e}`))
    if (!base || !changed) continue

    // Deleted
    if (!now) {
        if (!isMaintainer(before?.market, author)) errors.push(`${id}: only its maintainers can remove it`)
        summary.push(`### ${id}\nRemoved from the market.\n`)
        continue
    }

    // Who may submit
    if (RESERVED_PREFIXES.some((p) => id.startsWith(p)) && !isAdmin(author)) {
        errors.push(`${id}: identifiers starting with ${RESERVED_PREFIXES.join(", ")} are reserved; use your own reverse-DNS prefix`)
    }
    if (before) {
        if (!isMaintainer(before.market, author)) {
            errors.push(`${id}: @${author} is not a maintainer of this workflow (see its market.json on main)`)
        }
    } else if (!isMaintainer(now.market, author)) {
        errors.push(`${id}: add your GitHub username (@${author}) to "maintainers" in market.json`)
    }

    // Version bump when what users install changes
    const contentChanged = !before ||
        fileHash(headDir, "workflow.json") !== fileHash(baseDir, "workflow.json") ||
        fileHash(headDir, "icon.png") !== fileHash(baseDir, "icon.png")
    const oldVersion = before?.workflow?.version
    const newVersion = now.workflow?.version
    if (before && contentChanged && oldVersion && newVersion && compareVersions(newVersion, oldVersion) <= 0) {
        errors.push(`${id}: workflow.json or icon.png changed, so "version" must go above ${oldVersion}`)
    }

    // Review notes
    const oldPerms = permissionList(before?.workflow)
    const newPerms = permissionList(now.workflow)
    const added = newPerms.filter((p) => !oldPerms.includes(p))
    const removed = oldPerms.filter((p) => !newPerms.includes(p))
    const lines = [`### ${id}`]
    lines.push(before ? `Version ${oldVersion} → ${newVersion}` : `New workflow, version ${newVersion}`)
    lines.push(`Steps: ${stepKinds(now.workflow).join(", ") || "none"}`)
    lines.push(`Permissions: ${newPerms.length ? newPerms.map((p) => `\`${p}\``).join(", ") : "none"}`)
    if (before && added.length) lines.push(`⚠️ **New permissions:** ${added.map((p) => `\`${p}\``).join(", ")} (users are asked again)`)
    if (before && removed.length) lines.push(`Dropped permissions: ${removed.map((p) => `\`${p}\``).join(", ")}`)
    const oldMaint = (before?.market?.maintainers ?? []).join(", ")
    const newMaint = (now.market?.maintainers ?? []).join(", ")
    if (before && oldMaint !== newMaint) lines.push(`⚠️ **Maintainers changed:** ${oldMaint} → ${newMaint}`)
    summary.push(lines.join("\n\n") + "\n")
}

// ── Report ───────────────────────────────────────────────────────────────────

const report = [
    `## Workflow check${author ? ` for @${author}` : ""}`,
    errors.length ? `❌ ${errors.length} problem(s):\n\n${errors.map((e) => `- ${e}`).join("\n")}` : "✅ All checks passed.",
    summary.length ? `## Review notes\n\nRead every script in the diff before merging.\n\n${summary.join("\n")}` : "",
].filter(Boolean).join("\n\n")

console.log(report)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n")
process.exit(errors.length ? 1 : 0)
