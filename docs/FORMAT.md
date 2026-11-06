# Workflow format 1.0

A workflow is one JSON object (format 1.0), stored in the market as `workflows/<id>/workflow.json`. The easiest way to get one is to write it in AppPad (Settings › Workflows, or ask an AI assistant through AppPad's MCP server) and export it. To update a published workflow, edit it, raise `version`, and open a pull request.

Market rules on top of AppPad's own: one workflow per file (not an array); `description` is required; no `icon` or `iconURL` (put a square PNG next to it as `icon.png` instead, the market fills in `iconURL`); no local-only keys (`uid`, `enabled`, `panelKey`, `source`); `http` steps use https.

## Top-level fields

| Field | Type | Notes |
|---|---|---|
| `formatVersion` | string | Always `"1.0"`. |
| `id` | string | **Required.** Reverse-DNS, lowercase, at least two segments of `[a-z0-9-]`, e.g. `com.charles.diskfree`. The same id replaces the installed workflow. Never use the built-in ids (`com.youmindhub.*` from the built-in group). |
| `version` | string | `"1.0"`, `"1.1"`, … A replacement must have a HIGHER version than the installed one. |
| `name` | string | **Required.** English display name. |
| `description` | string | English, one sentence; shown in the panel preview. |
| `localizations` | object | Optional per language: `{"zh-Hans": {"name": "…", "description": "…", "argumentHint": "…", "keywords": ["…"]}}`. Languages: de, es, fr, it, ja, ko, nl, zh-Hans, zh-Hant. Missing fields fall back to English. |
| `group` | string | Optional free-text group shown in Settings. Not `"system"` (reserved). |
| `keywords` | [string] | Lowercase, no spaces. What the user types in the panel; an exact keyword ranks first. The first one appears in usage hints. |
| `argument` | string | `"none"` (default), `"optional"` or `"required"`: whether the panel text after the first space is passed in. |
| `argumentType` | string | How the argument is parsed (see below). Default `"text"`. |
| `argumentHint` | string | Short English placeholder, e.g. `"duration"`, `"keywords"`. |
| `symbol` | string | SF Symbol for the generated icon, e.g. `"terminal"`, `"globe"`. |
| `successNotice` | string | After a panel run: `"none"` (default, silent), `"output"` (notification with the final output) or `"custom"` (`successMessage`, `{{output}}` replaced). |
| `failureNotice` | string | `"error"` (default) or `"custom"` (`failureMessage`, `{{error}}` replaced). |
| `copyOutput` | bool | Also copy the final output to the clipboard (panel runs). |
| `confirm` | bool | Ask "Run …?" before every run. Use for destructive actions only. |
| `steps` | [step] | **Required**, at least one; run in order. |
| `permissions` | object | What the steps may do (see Permissions). |

## Argument types (what the FIRST step receives as input)

| `argumentType` | User types | Step input |
|---|---|---|
| `text` | anything | as typed |
| `duration` | `10` (minutes), `90s`, `1h30m`, `1:30` | seconds, e.g. `5400` (under 24 h) |
| `time` | `7:30`, `19:30`, `7pm`, optionally `+ label` | `HH:mm`, or `HH:mm` newline `label` |
| `number` | an integer | the integer |
| `percent` | `0`–`100` (clamped) | the integer |
| `reminder` | `tomorrow 3pm Call Mom !! @Work` | a JSON reminder for the `createReminder` action |

## Data flow

Each step's output becomes the next step's input; the last step's output is the workflow result. A step fails on a non-zero exit, timeout, non-2xx HTTP status or denied permission, and the run stops there. Every step has `timeout` (seconds, default 60).

## Step kinds (`"kind"`)

### `shell`
`{"kind": "shell", "script": "…", "timeout": 60}`
- The script is **zsh** (the macOS default shell), NOT bash: it runs as `/bin/zsh -f -c <script>` inside a sandbox, and a `#!` line is ignored. rc files are NOT loaded, but `PATH` is the user's login PATH (Homebrew tools work).
- Write zsh syntax. Where it differs from bash:
  - Arrays are 1-based: `${arr[1]}` is the first item. Read into an array with `read -A arr` (not `read -a`).
  - Unquoted `$var` is NOT word-split. Split explicitly: `${=var}` (whitespace), `${(s:,:)var}` (commas), `${(f)var}` (lines).
  - A glob with no match is an error. Add `(N)` to allow none: `for f in ~/Desktop/*.png(N)`.
  - `[[ $s =~ re ]]` puts captures in `$match` / `$MATCH`, not `BASH_REMATCH`.
  - `echo` interprets backslash escapes; use `printf '%s\n' "$x"` for exact output.
  - Bash-only builtins (`mapfile`, `readarray`, `shopt`) don't exist.
- Only if bash is really needed, call `bash -c '…'` inside the script (macOS ships the old bash 3.2: no associative arrays, no `mapfile`). Prefer zsh.
- Input arrives on **stdin** and in `$APPPAD_INPUT` (up to 64 KB). Output = stdout (trailing newlines trimmed). stderr is shown only on failure.
- Environment: `HOME`, `USER`, `PATH`, `LANG`, `APPPAD_WORKFLOW`, and `TMPDIR`, a per-run scratch directory that is also the working directory and is deleted afterwards. Here-documents (`<<'EOF'`) work.

### `appleScript`
`{"kind": "appleScript", "language": "appleScript" | "javaScript", "script": "…"}`
- Runs with `osascript` in the same sandbox. Input is the first argument (`on run argv` / `function run(argv)`) and stdin; the returned value is the output.
- Implies the `systemServices` permission. Works: plain AppleScript / JavaScript logic, `display notification`, `set volume`, `do shell script` (same sandbox), and system frameworks through JXA's ObjC bridge (e.g. `$.NSWorkspace.sharedWorkspace.runningApplications` + `hide`).
- Scripts cannot control other apps: macOS rejects Apple Events from sandboxed processes (error -10004), so `tell application "Finder"` / `Application("System Events")` fail. See [Sandbox limits](#sandbox-limits).

### `shortcut`
`{"kind": "shortcut", "shortcutName": "My Shortcut", "shortcutInput": ""}`
- Runs an Apple Shortcut by exact name. `shortcutInput` is a template: empty = the step input; `{{input}}` is replaced, `\n` becomes a newline. Output = the shortcut's text output.
- The shortcut must already exist in the Shortcuts app.

### `http`
`{"kind": "http", "http": {"method": "GET", "url": "https://api.example.com/x?q={{input}}", "headers": "Accept: application/json", "body": ""}}`
- `method`: GET, POST, PUT, PATCH, DELETE. `headers`: one `Name: Value` per line. `body` is sent for non-GET requests.
- `{{input}}` is percent-encoded in the URL and inserted raw in headers and body.
- `{{secret:NAME}}` inserts a Keychain secret (the user adds it in Settings › Workflows › Secrets; never put tokens in the JSON). Declare each NAME in `permissions.secrets`.
- The URL's host must be listed in `permissions.httpHosts`; redirects to other hosts are blocked. Output = response body. No `network` permission needed.

### `builtin`
`{"kind": "builtin", "builtin": "<action>"}` — AppPad's own actions:

| Action | Input |
|---|---|
| `emptyTrash`, `sleepDisplays`, `sleepMac`, `toggleDarkMode`, `toggleMute`, `ejectDisks`, `toggleHiddenFiles`, `quitAllApps`, `copyIPAddress`, `generateUUID`, `shutDown`, `restart`, `addToClaudeDesktop`, `removeFromClaudeDesktop`, `addYouMindHubToClaudeDesktop`, `removeYouMindHubFromClaudeDesktop`, `installHomebrew` | none |
| `keepAwake` | seconds; empty or 0 = until stopped |
| `setVolume` | 0–100 |
| `quitApp` | app name (exact, then prefix) |
| `openURL` | needs `"url"` on the step, e.g. `"https://www.google.com/search?q={{input}}"` (`{{input}}` percent-encoded). Refused: `file:` URLs and shortcut run URLs (`shortcuts://run-shortcut…`); run a shortcut with a `shortcut` step |
| `createReminder` | from `argumentType: "reminder"`, or plain text |
| `prefillTerminal` | needs `"command"` (one line, `{{input}}` inserted raw); optional `"directory"` (`~` allowed) |
| `openSystemSettings` | a System Settings page: name in any AppPad language (`displays`, `wifi`, `蓝牙`) or extension id (`com.apple.Displays-Settings.extension`); empty = System Settings itself |

As the first step, `openSystemSettings` parses the panel argument as a page name (the preview shows the page it found), whatever `argumentType` says. The built-in `com.youmindhub.systemsettings` already covers every page, so only write your own for a fixed page or a chain of steps.

`prefillTerminal` opens Terminal in `directory` with `command` typed at the prompt of the user's login shell (zsh by default). It never runs by itself: the user reads it and presses Return. Use it for work that must run outside the sandbox (build or release scripts, installers). `installHomebrew` works the same way with Homebrew's official install command. Example: `{"kind": "builtin", "builtin": "prefillTerminal", "directory": "~/Projects/App", "command": "sh build.sh"}`.

## Sandbox limits

`shell` and `appleScript` steps run in a sandbox. These never work there, whatever the permissions say; use the alternative instead:

| Not possible in a script | Use instead |
|---|---|
| Controlling other apps with Apple Events (`tell application …`, JXA `Application("…")`) | a `builtin` action (`quitApp`, `quitAllApps`, `toggleDarkMode`, `emptyTrash`, …), or JXA's ObjC bridge for app state (list / hide / unhide running apps) |
| Opening apps, files or URLs (`open`, `NSWorkspace` open calls) | `builtin` `openURL` for links |
| Running shortcuts (`shortcuts run`) | a `shortcut` step; pass data by chaining steps |
| Running commands in Terminal or outside the sandbox | `builtin` `prefillTerminal` (the user presses Return) |
| Quitting or signalling other apps (`kill`, `killall`), background jobs (`launchctl`) | `builtin` `quitApp` / `quitAllApps` |
| Changing preferences (`defaults write`) | not available (`defaults read` works with `systemServices`) |
| Files outside `TMPDIR` and the declared folders | declare `fileRead` / `fileWrite` |

The PR check lists scripts that look like they try one of these, so the reviewer can ask for a fix.

## Permissions

```json
"permissions": {
  "fileRead": ["~/Documents/Notes"], "fileWrite": ["~/Desktop"],
  "network": false, "systemServices": false,
  "httpHosts": ["api.github.com"], "secrets": ["GITHUB_TOKEN"]
}
```
- `shell` / `appleScript` run in a default-deny sandbox. They can always read system locations (/usr, /bin, /System, /Library, /Applications, /opt/homebrew, /etc) and use `TMPDIR`. Everything else must be declared:
  - `fileRead` / `fileWrite`: user folders (`~` allowed; write includes read).
  - `network`: outbound network for scripts (curl, git, gh…).
  - `systemServices`: clipboard (`pbcopy` / `pbpaste`), notifications (`display notification`), sound (`say`, `afplay`, AppleScript volume), reading preferences (`defaults read`), listing / hiding / unhiding running apps through JXA. Nothing that opens or launches anything (see [Sandbox limits](#sandbox-limits)).
  - `appleEvents`: leave it out. Controlling other apps is not possible, and the market rejects a non-empty list.
- `httpHosts` / `secrets`: for `http` steps. Shortcuts and built-in actions are permitted per item automatically (the user is asked).
- On the first run the user gets Allow Once / Always Allow / Don't Allow for undecided items. Declare the minimum: the smaller the list, the easier the approval.

## Validation (the PR check and AppPad both enforce this)

- At least one step; no empty scripts; a shortcut name for `shortcut` steps; an http(s) URL whose host is in `httpHosts` and every referenced secret in `secrets`; a `url` for `openURL` that is not a `file:` URL or a shortcut run URL; a one-line `command` (no control characters) for `prefillTerminal`.

## Examples

Shell, no permissions, no argument:
```json
{"formatVersion": "1.0", "id": "com.example.diskfree", "version": "1.0",
 "name": "Disk Free Space", "description": "Show free space on the startup disk.",
 "keywords": ["df", "disk"], "symbol": "internaldrive", "successNotice": "output",
 "steps": [{"kind": "shell", "script": "df -h / | awk 'NR==2 {print $4 \" free of \" $2}'"}]}
```

HTTP with a required argument and a secret:
```json
{"formatVersion": "1.0", "id": "com.example.deploy", "version": "1.0",
 "name": "Run Deploy", "description": "Trigger the deploy GitHub Action for a branch.",
 "keywords": ["deploy"], "symbol": "paperplane", "argument": "required",
 "argumentType": "text", "argumentHint": "branch", "successNotice": "custom",
 "successMessage": "Deploy started",
 "steps": [{"kind": "http", "timeout": 30, "http": {"method": "POST",
   "url": "https://api.github.com/repos/OWNER/REPO/actions/workflows/deploy.yml/dispatches",
   "headers": "Authorization: Bearer {{secret:GITHUB_TOKEN}}\nAccept: application/vnd.github+json",
   "body": "{\"ref\": \"{{input}}\"}"}}],
 "permissions": {"httpHosts": ["api.github.com"], "secrets": ["GITHUB_TOKEN"]}}
```

Two steps (the shell output feeds the next step):
```json
{"formatVersion": "1.0", "id": "com.example.searchclipboard", "version": "1.0",
 "name": "Search Clipboard", "description": "Search Google for the text on the clipboard.", "keywords": ["sc"], "symbol": "magnifyingglass",
 "steps": [{"kind": "shell", "script": "pbpaste | head -c 200"},
           {"kind": "builtin", "builtin": "openURL", "url": "https://www.google.com/search?q={{input}}"}],
 "permissions": {"systemServices": true}}
```

JXA through the ObjC bridge (hides every regular app; no Apple Events involved):
```json
{"formatVersion": "1.0", "id": "com.example.hideapps", "version": "1.0",
 "name": "Hide All Apps", "description": "Hide every open app.", "keywords": ["hideall"], "symbol": "eye.slash",
 "steps": [{"kind": "appleScript", "language": "javaScript",
   "script": "ObjC.import('AppKit'); const apps = $.NSWorkspace.sharedWorkspace.runningApplications; let n = 0; for (let i = 0; i < apps.count; i++) { const a = apps.objectAtIndex(i); if (Number(a.activationPolicy) !== 0) continue; a.hide; n++; } 'hidden ' + n"}],
 "permissions": {"systemServices": true}}
```

Script output into a shortcut (scripts can't call `shortcuts` themselves):
```json
{"formatVersion": "1.0", "id": "com.example.clipshortcut", "version": "1.0",
 "name": "Clipboard to Shortcut", "description": "Send the clipboard text to a shortcut.", "keywords": ["clipsc"], "symbol": "square.2.layers.3d",
 "steps": [{"kind": "shell", "script": "pbpaste | head -c 2000"},
           {"kind": "shortcut", "shortcutName": "My Shortcut"}],
 "permissions": {"systemServices": true}}
```
