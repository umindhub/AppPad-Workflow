# Submitting a workflow

[English](CONTRIBUTING.md) · [简体中文](docs/i18n/CONTRIBUTING.zh-Hans.md) · [繁體中文](docs/i18n/CONTRIBUTING.zh-Hant.md) · [日本語](docs/i18n/CONTRIBUTING.ja.md) · [한국어](docs/i18n/CONTRIBUTING.ko.md) · [Nederlands](docs/i18n/CONTRIBUTING.nl.md) · [Deutsch](docs/i18n/CONTRIBUTING.de.md) · [Español](docs/i18n/CONTRIBUTING.es.md) · [Français](docs/i18n/CONTRIBUTING.fr.md) · [Italiano](docs/i18n/CONTRIBUTING.it.md)

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
  "categories": ["files", "productivity"],
  "apps": [{ "bundleId": "com.apple.finder", "name": "Finder" }],
  "tags": ["finder", "path", "copy"],
  "example": "path"
}
```

| Field | |
|---|---|
| `maintainers` | **Required.** GitHub usernames allowed to update or remove this workflow. Yours must be in it. |
| `author.name` | **Required.** Shown in the market and in AppPad. `author.url` (https) is optional. |
| `categories` | **Required**, 1–3, main one first: `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | Apps it works with, up to 10: bundle id + the app's name. Every bundle id in `permissions.appleEvents` must be listed. Find a bundle id with `osascript -e 'id of app "Finder"'`. |
| `tags` | Up to 8 search words people might type: lowercase `a–z`, `0–9`, `-`, at most 24 characters each. |
| `example` | What to type in the Workflow panel, e.g. `timer 10`. |

The market search also covers the workflow's name, description and `keywords` in every
language it is translated into, so tags only need what those don't already say.

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
