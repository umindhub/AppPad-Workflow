// Shared rules for check.mjs (PRs) and build.mjs (deploy).
// Mirrors AppPad/Workflow/WorkflowModel.swift — keep both in sync when the format changes.

import { createHash } from "node:crypto"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

export const ADMINS = ["umindhub"]
export const RESERVED_PREFIXES = ["com.youmindhub."]

// Built-in identifiers (BuiltinWorkflows.all): never publishable, not even by admins.
export const BUILTIN_IDS = new Set([
    "com.youmindhub.emptytrash", "com.youmindhub.timer", "com.youmindhub.alarm", "com.youmindhub.reminder",
    "com.youmindhub.shutdown", "com.youmindhub.restart", "com.youmindhub.sleepdisplays", "com.youmindhub.sleep",
    "com.youmindhub.keepawake", "com.youmindhub.darkmode", "com.youmindhub.volume", "com.youmindhub.mute",
    "com.youmindhub.eject", "com.youmindhub.hiddenfiles", "com.youmindhub.quit", "com.youmindhub.websearch",
    "com.youmindhub.appstoresearch", "com.youmindhub.systemsettings", "com.youmindhub.workflowupdates",
    "com.youmindhub.ipaddress", "com.youmindhub.uuid",
    "com.youmindhub.claudedesktop.apppad.add", "com.youmindhub.claudedesktop.apppad.remove",
    "com.youmindhub.claudedesktop.youmindhub.add", "com.youmindhub.claudedesktop.youmindhub.remove",
    "com.youmindhub.homebrew.install",
])

export const FORMAT_VERSIONS = new Set(["1.0"])
export const LANGUAGES = new Set(["de", "es", "fr", "it", "ja", "ko", "nl", "zh-Hans", "zh-Hant"])
export const CATEGORIES = new Set(["productivity", "system", "developer", "web", "media", "files", "ai", "other"])

const STEP_KINDS = new Set(["shell", "appleScript", "shortcut", "http", "builtin"])
const SCRIPT_LANGUAGES = new Set(["appleScript", "javaScript"])
const BUILTIN_ACTIONS = new Set([
    "emptyTrash", "sleepDisplays", "sleepMac", "keepAwake", "toggleDarkMode", "setVolume", "toggleMute",
    "ejectDisks", "toggleHiddenFiles", "quitApp", "quitAllApps", "openURL", "copyIPAddress", "generateUUID",
    "shutDown", "restart", "createReminder",
    "addToClaudeDesktop", "removeFromClaudeDesktop",
    "addYouMindHubToClaudeDesktop", "removeYouMindHubFromClaudeDesktop",
    "installHomebrew", "prefillTerminal", "openSystemSettings", "checkWorkflowUpdates",
])
const ARGUMENT_MODES = new Set(["none", "optional", "required"])
const ARGUMENT_TYPES = new Set(["text", "duration", "time", "number", "percent", "reminder"])
const HTTP_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"])
const SUCCESS_NOTICES = new Set(["output", "custom", "none"])
const FAILURE_NOTICES = new Set(["error", "custom"])

// Export keys only; local-store keys (uid, enabled, panelKey, source) and icons are rejected.
const WORKFLOW_KEYS = new Set([
    "formatVersion", "id", "version", "name", "description", "localizations", "group", "keywords",
    "argument", "argumentType", "argumentHint", "symbol", "successNotice", "successMessage",
    "failureNotice", "failureMessage", "copyOutput", "confirm", "steps", "permissions",
])
const STEP_KEYS = new Set([
    "id", "kind", "script", "language", "shortcutName", "shortcutInput", "http", "builtin",
    "url", "command", "directory", "timeout",
])
const HTTP_KEYS = new Set(["method", "url", "headers", "body"])
const LOCALIZATION_KEYS = new Set(["name", "description", "argumentHint", "keywords"])
const PERMISSION_ARRAYS = ["fileRead", "fileWrite", "appleEvents", "httpHosts", "secrets"]
const PERMISSION_FLAGS = ["network", "systemServices"]
const MARKET_KEYS = new Set(["maintainers", "author", "category", "example"])

export const WORKFLOW_FILE = "workflow.json"
export const MARKET_FILE = "market.json"
export const ICON_FILE = "icon.png"
export const MAX_WORKFLOW_BYTES = 1_000_000   // AppPad's download limit
export const MAX_ICON_BYTES = 512 * 1024
const ALLOWED_FILES = new Set([WORKFLOW_FILE, MARKET_FILE, ICON_FILE])

const ID_RE = /^[a-z0-9][a-z0-9-]*(\.[a-z0-9][a-z0-9-]*)+$/
const VERSION_RE = /^[0-9]+(\.[0-9]+){0,3}$/
const GITHUB_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/

// ── Helpers ──────────────────────────────────────────────────────────────────

export const sha256 = (buf) => createHash("sha256").update(buf).digest("hex")

export const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v)

const isStringArray = (v) => Array.isArray(v) && v.every((x) => typeof x === "string")

// Numeric per component: 1.10 > 1.9, 1.0 == 1 (WorkflowIdentity.compareVersions).
export function compareVersions(a, b) {
    const x = a.split(".").map((n) => parseInt(n, 10) || 0)
    const y = b.split(".").map((n) => parseInt(n, 10) || 0)
    for (let i = 0; i < Math.max(x.length, y.length); i++) {
        const l = x[i] ?? 0
        const r = y[i] ?? 0
        if (l !== r) return l < r ? -1 : 1
    }
    return 0
}

export const isAdmin = (login) => ADMINS.some((a) => a.toLowerCase() === String(login).toLowerCase())

export const isMaintainer = (market, login) =>
    isAdmin(login) ||
    (market?.maintainers ?? []).some((m) => m.toLowerCase() === String(login).toLowerCase())

// Workflow folders under <root>/workflows (folder name = id).
export function listWorkflowDirs(root) {
    const dir = path.join(root, "workflows")
    if (!existsSync(dir)) return []
    return readdirSync(dir)
        .filter((name) => !name.startsWith("."))
        .filter((name) => statSync(path.join(dir, name)).isDirectory())
        .sort()
}

// PNG size from the IHDR chunk; null if not a PNG.
function pngSize(buf) {
    const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    if (buf.length < 24 || !sig.every((b, i) => buf[i] === b)) return null
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

// ── Validation ───────────────────────────────────────────────────────────────

function checkKeys(obj, allowed, where, errors) {
    for (const key of Object.keys(obj)) {
        if (!allowed.has(key)) errors.push(`${where}: unknown key "${key}"`)
    }
}

function validateStep(step, i, errors) {
    const where = `steps[${i}]`
    if (!isObject(step)) return errors.push(`${where}: must be an object`)
    checkKeys(step, STEP_KEYS, where, errors)
    if (!STEP_KINDS.has(step.kind)) errors.push(`${where}.kind: must be one of ${[...STEP_KINDS].join(", ")}`)
    for (const key of ["script", "shortcutName", "shortcutInput", "url", "command", "directory"]) {
        if (key in step && typeof step[key] !== "string") errors.push(`${where}.${key}: must be a string`)
    }
    if ("language" in step && !SCRIPT_LANGUAGES.has(step.language)) errors.push(`${where}.language: invalid`)
    if ("timeout" in step && !(typeof step.timeout === "number" && step.timeout > 0 && step.timeout <= 3600)) {
        errors.push(`${where}.timeout: must be a number of seconds (0–3600]`)
    }
    if (step.kind === "builtin" && !BUILTIN_ACTIONS.has(step.builtin)) {
        errors.push(`${where}.builtin: unknown action "${step.builtin}"`)
    } else if ("builtin" in step && typeof step.builtin !== "string") {
        errors.push(`${where}.builtin: must be a string`)
    }
    if (step.kind === "shell" || step.kind === "appleScript") {
        if (!step.script?.trim()) errors.push(`${where}.script: empty`)
    }
    if (step.kind === "shortcut" && !step.shortcutName?.trim()) errors.push(`${where}.shortcutName: empty`)
    if ("http" in step) {
        if (!isObject(step.http)) {
            errors.push(`${where}.http: must be an object`)
        } else {
            checkKeys(step.http, HTTP_KEYS, `${where}.http`, errors)
            if ("method" in step.http && !HTTP_METHODS.has(step.http.method)) errors.push(`${where}.http.method: invalid`)
            for (const key of ["url", "headers", "body"]) {
                if (key in step.http && typeof step.http[key] !== "string") errors.push(`${where}.http.${key}: must be a string`)
            }
            if (step.kind === "http" && !/^https:\/\//i.test(step.http.url ?? "")) {
                errors.push(`${where}.http.url: must be an https URL`)
            }
        }
    }
}

function validatePermissions(p, errors) {
    if (!isObject(p)) return errors.push("permissions: must be an object")
    checkKeys(p, new Set([...PERMISSION_ARRAYS, ...PERMISSION_FLAGS]), "permissions", errors)
    for (const key of PERMISSION_ARRAYS) {
        if (key in p && !isStringArray(p[key])) errors.push(`permissions.${key}: must be an array of strings`)
    }
    for (const key of PERMISSION_FLAGS) {
        if (key in p && typeof p[key] !== "boolean") errors.push(`permissions.${key}: must be true or false`)
    }
}

function validateLocalizations(table, errors) {
    if (!isObject(table)) return errors.push("localizations: must be an object")
    for (const [lang, entry] of Object.entries(table)) {
        if (!LANGUAGES.has(lang)) errors.push(`localizations.${lang}: unsupported language (use ${[...LANGUAGES].join(", ")})`)
        if (!isObject(entry)) {
            errors.push(`localizations.${lang}: must be an object`)
            continue
        }
        checkKeys(entry, LOCALIZATION_KEYS, `localizations.${lang}`, errors)
        for (const key of ["name", "description", "argumentHint"]) {
            if (key in entry && typeof entry[key] !== "string") errors.push(`localizations.${lang}.${key}: must be a string`)
        }
        if ("keywords" in entry && !isStringArray(entry.keywords)) errors.push(`localizations.${lang}.keywords: must be an array of strings`)
    }
}

export function validateWorkflow(w, folderName) {
    const errors = []
    if (!isObject(w)) return ["workflow.json: must be a single workflow object (not an array)"]
    checkKeys(w, WORKFLOW_KEYS, "workflow.json", errors)

    if (!FORMAT_VERSIONS.has(String(w.formatVersion))) {
        errors.push(`formatVersion: must be one of ${[...FORMAT_VERSIONS].join(", ")} (as a string)`)
    }
    if (typeof w.id !== "string" || !ID_RE.test(w.id)) errors.push("id: must be a lowercase reverse-DNS identifier, e.g. com.example.mytool")
    else if (w.id !== folderName) errors.push(`id: "${w.id}" must equal the folder name "${folderName}"`)
    if (typeof w.version !== "string" || !VERSION_RE.test(w.version)) errors.push("version: must look like 1.0, 1.2 or 2.0.1")
    if (typeof w.name !== "string" || !w.name.trim()) errors.push("name: required (English)")
    if (typeof w.description !== "string" || !w.description.trim()) errors.push("description: required (English)")
    if ("localizations" in w) validateLocalizations(w.localizations, errors)
    if ("group" in w) {
        if (typeof w.group !== "string") errors.push("group: must be a string")
        else if (w.group.toLowerCase() === "system") errors.push(`group: "system" is reserved for AppPad's built-in workflows`)
    }
    if ("keywords" in w && !isStringArray(w.keywords)) errors.push("keywords: must be an array of strings")
    if ("argument" in w && !ARGUMENT_MODES.has(w.argument)) errors.push("argument: must be none, optional or required")
    if ("argumentType" in w && !ARGUMENT_TYPES.has(w.argumentType)) errors.push("argumentType: invalid")
    for (const key of ["argumentHint", "symbol", "successMessage", "failureMessage"]) {
        if (key in w && typeof w[key] !== "string") errors.push(`${key}: must be a string`)
    }
    if ("successNotice" in w && !SUCCESS_NOTICES.has(w.successNotice)) errors.push("successNotice: must be output, custom or none")
    if ("failureNotice" in w && !FAILURE_NOTICES.has(w.failureNotice)) errors.push("failureNotice: must be error or custom")
    for (const key of ["copyOutput", "confirm"]) {
        if (key in w && typeof w[key] !== "boolean") errors.push(`${key}: must be true or false`)
    }
    if (!Array.isArray(w.steps) || w.steps.length === 0) errors.push("steps: at least one step is required")
    else w.steps.forEach((s, i) => validateStep(s, i, errors))
    if ("permissions" in w) validatePermissions(w.permissions, errors)
    if (Array.isArray(w.steps)) checkDeclared(w, errors)
    return errors
}

// HTTP hosts and {{secret:NAME}} must be declared, the same rule AppPad applies on save.
function checkDeclared(w, errors) {
    const p = isObject(w.permissions) ? w.permissions : {}
    const hosts = new Set((p.httpHosts ?? []).map((h) => String(h).toLowerCase()))
    const secrets = new Set(p.secrets ?? [])
    w.steps.forEach((step, i) => {
        if (!isObject(step) || step.kind !== "http" || !isObject(step.http)) return
        try {
            const host = new URL(String(step.http.url).replaceAll("{{input}}", "x")).hostname.toLowerCase()
            if (!hosts.has(host)) errors.push(`steps[${i}]: host "${host}" must be listed in permissions.httpHosts`)
        } catch {
            errors.push(`steps[${i}].http.url: not a valid URL`)
        }
        const text = [step.http.url, step.http.headers, step.http.body].join("\n")
        for (const [, name] of text.matchAll(/\{\{secret:([A-Za-z0-9_.-]+)\}\}/g)) {
            if (!secrets.has(name)) errors.push(`steps[${i}]: secret "${name}" must be listed in permissions.secrets`)
        }
    })
}

export function validateMarket(m) {
    const errors = []
    if (!isObject(m)) return ["market.json: must be an object"]
    checkKeys(m, MARKET_KEYS, "market.json", errors)
    if (!Array.isArray(m.maintainers) || m.maintainers.length === 0 || !m.maintainers.every((x) => typeof x === "string" && GITHUB_RE.test(x))) {
        errors.push("market.json maintainers: list the GitHub usernames allowed to update this workflow")
    }
    if (!isObject(m.author) || typeof m.author.name !== "string" || !m.author.name.trim()) {
        errors.push('market.json author.name: required, e.g. { "name": "Jane Doe" }')
    } else {
        checkKeys(m.author, new Set(["name", "url"]), "market.json author", errors)
        if ("url" in m.author && !/^https:\/\/[^\s]+$/i.test(m.author.url)) errors.push("market.json author.url: must be an https URL")
    }
    if ("category" in m && !CATEGORIES.has(m.category)) errors.push(`market.json category: one of ${[...CATEGORIES].join(", ")}`)
    if ("example" in m && (typeof m.example !== "string" || m.example.length > 80)) errors.push("market.json example: a short string (≤ 80 characters)")
    return errors
}

// Reads and validates one folder; { id, workflow, market, raw, icon, errors }.
export function loadFolder(root, id) {
    const dir = path.join(root, "workflows", id)
    const errors = []
    const result = { id, dir, workflow: null, market: null, raw: null, icon: null, errors }

    for (const name of readdirSync(dir)) {
        if (!ALLOWED_FILES.has(name)) errors.push(`${name}: only ${[...ALLOWED_FILES].join(", ")} are allowed in a workflow folder`)
    }
    if (BUILTIN_IDS.has(id)) errors.push(`${id}: reserved for an AppPad built-in workflow`)

    const workflowPath = path.join(dir, WORKFLOW_FILE)
    if (!existsSync(workflowPath)) {
        errors.push("workflow.json: missing")
    } else {
        result.raw = readFileSync(workflowPath)
        if (result.raw.length > MAX_WORKFLOW_BYTES) errors.push("workflow.json: larger than 1 MB")
        try {
            result.workflow = JSON.parse(result.raw.toString("utf8"))
            errors.push(...validateWorkflow(result.workflow, id))
        } catch (e) {
            errors.push(`workflow.json: invalid JSON (${e.message})`)
        }
    }

    const marketPath = path.join(dir, MARKET_FILE)
    if (!existsSync(marketPath)) {
        errors.push("market.json: missing")
    } else {
        try {
            result.market = JSON.parse(readFileSync(marketPath, "utf8"))
            errors.push(...validateMarket(result.market))
        } catch (e) {
            errors.push(`market.json: invalid JSON (${e.message})`)
        }
    }

    const iconPath = path.join(dir, ICON_FILE)
    if (existsSync(iconPath)) {
        result.icon = readFileSync(iconPath)
        const size = pngSize(result.icon)
        if (!size) errors.push("icon.png: not a PNG file")
        else if (size.width !== size.height || size.width < 128 || size.width > 1024) {
            errors.push(`icon.png: must be square, 128–1024 px (512×512 recommended), got ${size.width}×${size.height}`)
        }
        if (result.icon.length > MAX_ICON_BYTES) errors.push("icon.png: larger than 512 KB")
    }
    return result
}

// ── Permission summary (PR review) ───────────────────────────────────────────

// Flat, comparable list: "network", "fileRead:~/Desktop", "appleEvents:com.apple.finder" …
export function permissionList(w) {
    const p = isObject(w?.permissions) ? w.permissions : {}
    const items = []
    for (const key of PERMISSION_FLAGS) if (p[key] === true) items.push(key)
    for (const key of PERMISSION_ARRAYS) for (const v of p[key] ?? []) items.push(`${key}:${v}`)
    return items.sort()
}

export const stepKinds = (w) => [...new Set((w?.steps ?? []).map((s) => s.kind))]
