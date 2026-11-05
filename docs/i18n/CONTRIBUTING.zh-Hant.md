# 投稿工作流程

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

任何人都可以透過 pull request 把工作流程發佈到 AppPad 工作流程市集。每份投稿都會先自動檢查，再由人工審閱後才上架。

## 1. 在 AppPad 裡撰寫並測試

在 AppPad 裡建立工作流程（設定 › 工作流程，或透過 AppPad 的 MCP 伺服器請 AI 助理撰寫），執行一次，再匯出成 JSON。格式說明見 [docs/FORMAT.md](../FORMAT.md)（英文）。

`id` 請使用你自己掌控的反向網域前綴，例如 `io.github.yourname.diskfree`。`com.youmindhub.*` 為保留前綴。

## 2. 加入資料夾

```
workflows/<id>/
  workflow.json   必要 — 匯出的工作流程（單一物件，不是陣列）
  market.json     必要 — 上架資訊，見下文
  icon.png        選用 — 正方形 PNG，建議 512×512，不超過 512 KB
```

資料夾名稱必須和工作流程的 `id` 相同，不允許放其他檔案。

投稿前請從 `workflow.json` 刪除 `icon` / `iconURL`；市集會提供 `icon.png` 並自動補上 `iconURL`。沒有圖示時，AppPad 會依 `symbol` 繪製。

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

| 欄位 | |
|---|---|
| `maintainers` | **必填。** 允許更新或移除這個工作流程的 GitHub 使用者名稱，必須包含你自己。 |
| `author.name` | **必填。** 顯示在市集和 AppPad 中。`author.url`（https）可選。 |
| `categories` | **必填**，1–3 個，主分類放第一個：`productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`。 |
| `apps` | 適用的 App，最多 10 個：bundle id 加 App 名稱。`permissions.appleEvents` 中的每個 bundle id 都必須列出。可用 `osascript -e 'id of app "Finder"'` 查詢 bundle id。 |
| `tags` | 最多 8 個搜尋詞：小寫 `a–z`、`0–9`、`-`，每個不超過 24 個字元。 |
| `example` | 在工作台中輸入的內容，例如 `timer 10`。 |

市集搜尋也會涵蓋工作流程在所有已翻譯語言中的名稱、說明和 `keywords`，所以標籤只需補上這些沒有的詞。

## 3. 提交 pull request

每個 pull request 只放一個工作流程。檢查會告訴你需要修正什麼：格式、資料夾內容、你是否為維護者、`version` 是否提高。它也會列出審核者需要批准的權限。

## 更新

修改檔案，把 `workflow.json` 裡的 `version` 調高（高於已發佈的版本），再提交 pull request。只有已發佈 `market.json` 中列出的維護者可以這麼做。AppPad 的「檢查工作流程更新」會把新版本提供給所有安裝過的使用者；如果新版本要求新的權限，AppPad 會再次詢問使用者。

## 會被拒絕的情況

- 要求不需要的權限，或沒有說明為什麼需要。
- 程式碼經過混淆、壓縮，或在執行時下載再執行（`curl … | sh`）。
- 蒐集或傳送使用者沒有要求的任何內容。
- 自行在終端機執行指令。`prefillTerminal` 沒問題：需要使用者自己按 Return。
- [LICENSE.md](../../LICENSE.md) 中「Not allowed」列出的任何內容。

投稿即表示你同意 [LICENSE.md](../../LICENSE.md)（以英文版為準）：著作權歸你所有，YouMindHub 可以透過市集、youmindhub.com 和 AppPad 託管和散佈你的工作流程。
