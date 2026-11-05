# Submitting a workflow

Anyone can publish a workflow in the AppPad Workflow Market with a pull request. Every
submission is checked automatically and then read by a person before it goes live.

## 1. Write and test it in AppPad

Create the workflow in AppPad (Settings › Workflows, or ask an AI assistant through AppPad's
MCP server), run it, then export it as JSON. The format is described in
[docs/FORMAT.md](docs/FORMAT.md).

Pick an `id` under a reverse-DNS prefix you control, e.g. `io.github.yourname.diskfree`.
`com.youmindhub.*` is reserved.

## 2. Add a folder

```
workflows/<id>/
  workflow.json   required — the exported workflow (one object, not an array)
  market.json     required — listing details, see below
  icon.png        optional — square PNG, 512×512 recommended, at most 512 KB
```

The folder name must equal the workflow's `id`. No other files are allowed.

Remove `icon` / `iconURL` from `workflow.json` before you submit; the market serves
`icon.png` and fills in `iconURL` for you. Without an icon, AppPad draws one from `symbol`.

### market.json

```json
{
  "maintainers": ["your-github-username"],
  "author": { "name": "Your Name", "url": "https://your.site" },
  "category": "productivity",
  "example": "df"
}
```

| Field | |
|---|---|
| `maintainers` | GitHub usernames allowed to update or remove this workflow. Yours must be in it. |
| `author.name` | Shown in the market and in AppPad. `author.url` (https) is optional. |
| `category` | One of `productivity`, `system`, `developer`, `web`, `media`, `files`, `ai`, `other`. |
| `example` | What to type in the Workflow panel, e.g. `timer 10`. |

## 3. Open a pull request

One workflow per pull request. The check tells you what to fix: format, folder contents,
whether you're a maintainer, and whether `version` went up. It also lists the permissions the
reviewer has to approve.

## Updating

Change the files, raise `version` in `workflow.json` (above the published one), and open a
pull request. Only the maintainers listed in the published `market.json` can do this.
AppPad's "Check Workflow Updates" offers the new version to everyone who installed it; if it
asks for new permissions, AppPad asks the user again.

## What gets a workflow declined

- Permissions it doesn't need, or no explanation for the ones it asks for.
- Code that is obfuscated, minified, or downloaded and run (`curl … | sh`).
- Collecting or sending anything the user didn't ask for.
- Running commands in Terminal by itself. `prefillTerminal` is fine: the user presses Return.
- Anything listed under "Not allowed" in [LICENSE.md](LICENSE.md).

By submitting, you agree to [LICENSE.md](LICENSE.md): copyright stays with you, and YouMindHub
may host and distribute your workflow through the market, youmindhub.com and AppPad.
