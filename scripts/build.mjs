// Builds the static market into dist/ (deployed to Cloudflare Pages):
//
//   dist/v1/index.json                    every workflow + sha256 of its published file
//   dist/v1/index.json.sig                Ed25519 signature of index.json (base64)
//   dist/v1/workflows/<id>/workflow.json  published file (iconURL added when there is an icon)
//   dist/v1/workflows/<id>/icon.png
//
//   MARKET_BASE_URL=https://apppadworkflow.pages.dev MARKET_SIGNING_KEY="$(cat key.pem)" node scripts/build.mjs
//   node scripts/build.mjs --unsigned      (local preview only; AppPad rejects it)

import { execFileSync } from "node:child_process"
import { sign as edSign, createPrivateKey } from "node:crypto"
import { mkdirSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { ICON_FILE, WORKFLOW_FILE, listWorkflowDirs, loadFolder, sha256, stepKinds } from "./lib.mjs"

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const DIST = path.join(ROOT, "dist")
const SITE_MARKET_PAGE = "https://youmindhub.com/i/apppad/workflows"

const unsigned = process.argv.includes("--unsigned")
const baseURL = (process.env.MARKET_BASE_URL ?? "").replace(/\/+$/, "")
if (!/^https:\/\/[^/]+$/.test(baseURL) && !unsigned) {
    console.error("MARKET_BASE_URL must be an https origin, e.g. https://apppadworkflow.pages.dev")
    process.exit(1)
}

function lastChange(id) {
    try {
        const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", `workflows/${id}`], { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim()
        return out || null
    } catch {
        return null
    }
}

// Display fields only (the app reads the full file).
function localizedText(table) {
    const out = {}
    for (const [lang, entry] of Object.entries(table ?? {})) {
        const picked = {}
        for (const key of ["name", "description", "argumentHint"]) if (entry[key]) picked[key] = entry[key]
        if (Object.keys(picked).length) out[lang] = picked
    }
    return out
}

rmSync(DIST, { recursive: true, force: true })
mkdirSync(path.join(DIST, "v1", "workflows"), { recursive: true })

const failures = []
const entries = []

for (const id of listWorkflowDirs(ROOT)) {
    const folder = loadFolder(ROOT, id)
    if (folder.errors.length) {
        failures.push(...folder.errors.map((e) => `${id}: ${e}`))
        continue
    }
    const outDir = path.join(DIST, "v1", "workflows", id)
    mkdirSync(outDir, { recursive: true })

    const published = { ...folder.workflow }
    let iconPath = null
    if (folder.icon) {
        iconPath = `workflows/${id}/${ICON_FILE}`
        writeFileSync(path.join(outDir, ICON_FILE), folder.icon)
        published.iconURL = `${baseURL}/v1/${iconPath}`
    }
    const bytes = Buffer.from(JSON.stringify(published, null, 2) + "\n", "utf8")
    writeFileSync(path.join(outDir, WORKFLOW_FILE), bytes)

    const w = folder.workflow
    const m = folder.market
    entries.push({
        id,
        version: w.version,
        formatVersion: String(w.formatVersion),
        name: w.name,
        description: w.description,
        localizations: localizedText(w.localizations),
        keywords: w.keywords ?? [],
        argument: w.argument ?? "none",
        argumentHint: w.argumentHint ?? "",
        example: m.example ?? "",
        category: m.category ?? "other",
        author: { name: m.author.name, ...(m.author.url ? { url: m.author.url } : {}) },
        maintainers: m.maintainers,
        stepKinds: stepKinds(w),
        permissions: w.permissions ?? {},
        file: `workflows/${id}/${WORKFLOW_FILE}`,
        sha256: sha256(bytes),
        size: bytes.length,
        icon: iconPath,
        updatedAt: lastChange(id),
    })
}

if (failures.length) {
    console.error(`Build failed:\n${failures.map((f) => `- ${f}`).join("\n")}`)
    process.exit(1)
}

entries.sort((a, b) => a.name.localeCompare(b.name, "en"))
const index = Buffer.from(
    JSON.stringify({ schema: 1, generatedAt: new Date().toISOString(), baseURL, workflows: entries }, null, 2) + "\n",
    "utf8",
)
writeFileSync(path.join(DIST, "v1", "index.json"), index)

if (!unsigned) {
    const pem = process.env.MARKET_SIGNING_KEY
    if (!pem) {
        console.error("MARKET_SIGNING_KEY is not set (Ed25519 private key, PKCS#8 PEM).")
        process.exit(1)
    }
    const signature = edSign(null, index, createPrivateKey(pem))
    writeFileSync(path.join(DIST, "v1", "index.json.sig"), signature.toString("base64") + "\n")
}

// Public JSON for AppPad and the website; short cache so new workflows show up quickly.
writeFileSync(
    path.join(DIST, "_headers"),
    [
        "/v1/*",
        "  Access-Control-Allow-Origin: *",
        "  Cache-Control: public, max-age=300",
        "  X-Content-Type-Options: nosniff",
        "",
    ].join("\n"),
)
writeFileSync(
    path.join(DIST, "index.html"),
    `<!doctype html><meta charset="utf-8"><title>AppPad Workflow Market</title>` +
        `<meta http-equiv="refresh" content="0; url=${SITE_MARKET_PAGE}"><a href="${SITE_MARKET_PAGE}">${SITE_MARKET_PAGE}</a>\n`,
)

console.log(`Built ${entries.length} workflow(s)${unsigned ? " (UNSIGNED preview)" : ""} → dist/`)
