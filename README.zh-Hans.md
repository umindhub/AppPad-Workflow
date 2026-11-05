# AppPad 工作流市场

[AppPad](https://youmindhub.com/i/apppad) 工作台（⌘空格）的工作流，从这个仓库发布。
在 **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)** 浏览。

[English](README.md)

## 投稿

提交一个 pull request，内容是 `workflows/<id>/` 下的一个文件夹。先读
[CONTRIBUTING.md](CONTRIBUTING.md)，格式说明见 [docs/FORMAT.md](docs/FORMAT.md)。

## 安装流程

网站上的“安装”按钮打开 `apppad://workflow/install?id=<id>`，链接里只有 id。AppPad
下载本市场签名过的索引，校验 Ed25519 签名，再下载工作流并按索引里的 SHA-256 校验，
添加前会显示它做什么、要哪些权限。链接无法让 AppPad 去下载其他任何文件。

更新同理：“检查工作流更新”拿已安装的版本和签名索引比较。

## 授权

本仓库不是开源项目。每个工作流的版权归其作者；投稿即授权 YouMindHub 通过工作流市场、
youmindhub.com 和 AppPad 托管与分发。仓库中其余内容 © YouMindHub，保留所有权利。
完整条款见 [LICENSE.md](LICENSE.md)。

## 维护者说明

| 分支 | Pages 项目（Direct Upload） | 地址 | 使用方 |
|---|---|---|---|
| `main` | `apppadworkflow` | `https://apppadworkflow.pages.dev/v1/` | AppPad Beta / Release、youmindhub.com |
| `dev` | `devapppadworkflow` | `https://devapppadworkflow.pages.dev/v1/` | AppPad Dev、dev.youmindhub.com |

仓库设置：Secrets 为 `CLOUDFLARE_PAGES_DEPLOY_TOKEN`（Account › Cloudflare Pages › Edit）、
`CLOUDFLARE_ACCOUNT_ID`、`MARKET_SIGNING_KEY`（`npm run keygen` 生成）；Variables 为
`CLOUDFLARE_PROJECT_NAME` = `apppadworkflow`、`CLOUDFLARE_DEV_PROJECT_NAME` = `devapppadworkflow`。

PR 由 `.github/workflows/check.yml` 检查：它运行的是 **base 分支** 的 `scripts/check.mjs`，
不会执行 PR 里的任何代码。推送到 `main` 或 `dev` 会校验、构建、签名，再用 wrangler 直接上传 `dist/`
（`.github/workflows/deploy.yml`）。

投稿者只能改 `workflows/` 里的文件。贡献者对 `.github/`、`scripts/` 等 `workflows/`
之外的改动一律不要合并。

脚本只用 Node 自带模块，不需要 `npm install`。本地命令：`npm run check`（校验）、
`npm run preview`（不签名构建到 `dist/`）、`npm run keygen`（生成签名密钥）。
