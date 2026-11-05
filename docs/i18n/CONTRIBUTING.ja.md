# ワークフローを投稿する

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

誰でも pull request で AppPad ワークフローマーケットにワークフローを公開できます。投稿はすべて自動チェックのあと、人が読んでから公開されます。

## 1. AppPad で作ってテストする

AppPad でワークフローを作成し（設定 › ワークフロー、または AppPad の MCP サーバ経由で AI アシスタントに依頼）、実行してから JSON として書き出します。形式は [docs/FORMAT.md](../FORMAT.md)（英語）にあります。

`id` は自分が管理する逆ドメイン形式の接頭辞にしてください（例：`io.github.yourname.diskfree`）。`com.youmindhub.*` は予約済みです。

## 2. フォルダを追加する

```
workflows/<id>/
  workflow.json   必須 — 書き出したワークフロー（配列ではなく 1 つのオブジェクト）
  market.json     必須 — 掲載情報（下記参照）
  icon.png        任意 — 正方形の PNG、512×512 推奨、512 KB 以下
```

フォルダ名はワークフローの `id` と同じにしてください。ほかのファイルは置けません。

投稿前に `workflow.json` から `icon` / `iconURL` を削除してください。マーケットが `icon.png` を配信し、`iconURL` を自動で追加します。アイコンがない場合、AppPad は `symbol` から描画します。

### market.json

```json
{
  "maintainers": ["your-github-username"],
  "author": { "name": "Your Name", "url": "https://your.site" },
  "categories": ["files", "productivity"],
  "apps": ["Finder"],
  "tags": ["path", "copy"],
  "example": "path",
  "localizations": {
    "zh-Hans": { "apps": { "Finder": "访达" }, "tags": { "path": "路径", "copy": "复制" } },
    "ja": { "tags": { "path": "パス", "copy": "コピー" } }
  }
}
```

| フィールド | |
|---|---|
| `maintainers` | **必須。** このワークフローを更新・削除できる GitHub ユーザ名。自分を含めてください。 |
| `author.name` | **必須。** マーケットと AppPad に表示されます。`author.url`（https）は任意です。 |
| `categories` | **必須**、1〜3 個、メインのカテゴリを先頭に：`productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`。 |
| `apps` | 対応する App、最大 10 個。一般的な名前で書きます（`Finder`、`Safari`、`Photoshop`）。ページに表示され、検索と App での絞り込みに使われます。 |
| `tags` | 英語の検索語、最大 8 個：小文字の `a–z`、`0–9`、`-`、各 24 文字以内。翻訳は `localizations` に書きます。 |
| `example` | ワークフローパネルで入力する内容（例：`timer 10`）。 |
| `localizations` | 任意、言語ごと（`zh-Hans`, `zh-Hant`, `ja`, `ko`, `nl`, `de`, `es`, `fr`, `it`）：`apps` と `tags` で英語名ごとに訳語を指定します。指定がないものは英語で表示されます。カテゴリ名はマーケットが翻訳します。 |

マーケットの検索は、翻訳されたすべての言語の名前・説明・`keywords` も対象にするため、タグにはそこにない語だけを入れれば十分です。

## 3. pull request を作成する

pull request 1 つにつきワークフロー 1 つにしてください。チェックが、形式、フォルダの内容、メンテナかどうか、`version` が上がっているかなど、直すべき点を示します。レビュアーが承認すべき権限も一覧にします。

## アップデート

ファイルを変更し、`workflow.json` の `version` を公開中のものより上げて pull request を作成します。これができるのは、公開中の `market.json` にあるメンテナだけです。AppPad の「ワークフローのアップデートを確認」で、インストールした全員に新しいバージョンが届きます。新しい権限が必要な場合、AppPad はユーザに改めて確認します。

## 却下される例

- 必要のない権限を求めている、または必要な理由の説明がない。
- 難読化・圧縮されたコード、または実行時にダウンロードして実行するコード（`curl … | sh`）。
- ユーザが求めていないものを収集・送信する。
- 自分でターミナルのコマンドを実行する。`prefillTerminal` は問題ありません（ユーザが Return を押します）。
- [LICENSE.md](../../LICENSE.md) の「Not allowed」にあるもの。

投稿すると [LICENSE.md](../../LICENSE.md)（英語版が正式）に同意したことになります。著作権はあなたに残り、YouMindHub はマーケット、youmindhub.com、AppPad を通じてワークフローをホスト・配布できます。
