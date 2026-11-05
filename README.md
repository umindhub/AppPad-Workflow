# AppPad Workflow Market

Workflows for [AppPad](https://youmindhub.com/i/apppad)'s Workflow panel (⌘Space), published
from this repository. Browse them at **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**.

[简体中文](README.zh-Hans.md)

## Submit a workflow

Open a pull request with one folder in `workflows/<id>/`. Read
[CONTRIBUTING.md](CONTRIBUTING.md) first; the format is in [docs/FORMAT.md](docs/FORMAT.md).

## How installing works

The website's Install button opens `apppad://workflow/install?id=<id>`. The link carries
only the id. AppPad downloads this market's signed index, checks its Ed25519 signature,
downloads the workflow, checks its SHA-256 against the index, and shows you what it does and
which permissions it asks for before adding it. A link can't point AppPad at any other file.

Updates work the same way: "Check Workflow Updates" compares installed versions with the
signed index.

## License

Not open source. Each workflow belongs to its author; by submitting one you let YouMindHub
host and distribute it through the market, youmindhub.com and AppPad. Everything else in this
repository is © YouMindHub, all rights reserved. Full terms: [LICENSE.md](LICENSE.md).

## Maintainers

| Branch | Pages project (Direct Upload) | Served at | Used by |
|---|---|---|---|
| `main` | `apppadworkflow` | `https://apppadworkflow.pages.dev/v1/` | AppPad Beta / Release, youmindhub.com |
| `dev` | `devapppadworkflow` | `https://devapppadworkflow.pages.dev/v1/` | AppPad Dev, dev.youmindhub.com |

Repository settings: secrets `CLOUDFLARE_PAGES_DEPLOY_TOKEN` (Account › Cloudflare Pages › Edit),
`CLOUDFLARE_ACCOUNT_ID`, `MARKET_SIGNING_KEY` (from `npm run keygen`); variables
`CLOUDFLARE_PROJECT_NAME` = `apppadworkflow`, `CLOUDFLARE_DEV_PROJECT_NAME` = `devapppadworkflow`.

Pull requests are checked by `.github/workflows/check.yml`, which runs the **base branch's**
`scripts/check.mjs` and never executes code from the pull request. A push to `main` or `dev`
validates, builds, signs and uploads `dist/` with wrangler (`.github/workflows/deploy.yml`).

Contributors can only change files inside `workflows/`. Never merge a contributor's change to
`.github/`, `scripts/` or anything else outside `workflows/`.

Local commands: `npm run check` (validate), `npm run preview` (unsigned build into `dist/`).
