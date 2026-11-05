# 投稿工作流

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

任何人都可以通过 pull request 把工作流发布到 AppPad 工作流市场。每份投稿都会先自动检查，再由人工审读后才上线。

## 1. 在 AppPad 里编写并测试

在 AppPad 里创建工作流（设置 › 工作流，或通过 AppPad 的 MCP 服务器让 AI 助手来写），运行一遍，然后导出为 JSON。格式说明见 [docs/FORMAT.md](../FORMAT.md)（英文）。

`id` 请使用你自己控制的反向域名前缀，例如 `io.github.yourname.diskfree`。`com.youmindhub.*` 为保留前缀。

## 2. 添加文件夹

```
workflows/<id>/
  workflow.json   必需 — 导出的工作流（单个对象，不是数组）
  market.json     必需 — 上架信息，见下文
  icon.png        可选 — 正方形 PNG，建议 512×512，不超过 512 KB
```

文件夹名必须和工作流的 `id` 相同，不允许放其他文件。

投稿前请从 `workflow.json` 里删掉 `icon` / `iconURL`；市场会提供 `icon.png` 并自动补上 `iconURL`。没有图标时，AppPad 会根据 `symbol` 绘制。

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

| 字段 | |
|---|---|
| `maintainers` | **必填。** 允许更新或移除这个工作流的 GitHub 用户名，必须包含你自己。 |
| `author.name` | **必填。** 显示在市场和 AppPad 中。`author.url`（https）可选。 |
| `categories` | **必填**，1–3 个，主分类放第一个：`productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`。 |
| `apps` | 适用的 App，最多 10 个：bundle id 加 App 名称。`permissions.appleEvents` 里的每个 bundle id 都必须列出。可用 `osascript -e 'id of app "Finder"'` 查 bundle id。 |
| `tags` | 最多 8 个搜索词：小写 `a–z`、`0–9`、`-`，每个不超过 24 个字符。 |
| `example` | 在工作台里输入的内容，例如 `timer 10`。 |

市场搜索还会覆盖工作流在所有已翻译语言里的名称、描述和 `keywords`，所以标签只需补充这些里没有的词。

## 3. 提交 pull request

每个 pull request 只放一个工作流。检查会告诉你要修什么：格式、文件夹内容、你是不是维护者、`version` 有没有升高。它还会列出审核者需要批准的权限。

## 更新

修改文件，把 `workflow.json` 里的 `version` 调高（高于已发布的版本），然后提交 pull request。只有已发布 `market.json` 里列出的维护者可以这样做。AppPad 的“检查工作流更新”会把新版本推给所有安装过的用户；如果新版本要求新的权限，AppPad 会再次询问用户。

## 会被拒绝的情况

- 要了不需要的权限，或者没解释为什么需要。
- 代码经过混淆、压缩，或在运行时下载再执行（`curl … | sh`）。
- 收集或发送用户没要求的任何内容。
- 自己在终端里执行命令。`prefillTerminal` 没问题：需要用户自己按回车。
- [LICENSE.md](../../LICENSE.md) 中“Not allowed”列出的任何内容。

投稿即表示你同意 [LICENSE.md](../../LICENSE.md)（以英文版为准）：版权归你所有，YouMindHub 可以通过市场、youmindhub.com 和 AppPad 托管和分发你的工作流。
