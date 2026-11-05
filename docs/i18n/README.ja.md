# AppPad ワークフローマーケット

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

[AppPad](https://youmindhub.com/i/apppad) のワークフローパネル（⌘スペース）で使うワークフローを、このリポジトリから公開しています。**[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)** で一覧できます。

## 投稿する

`workflows/<id>/` にフォルダを 1 つ追加して pull request を作成してください。まず [CONTRIBUTING](CONTRIBUTING.ja.md) を読んでください。`workflow.json` の形式は [docs/FORMAT.md](../FORMAT.md)（英語）にあります。

## インストールの仕組み

Web サイトのインストールボタンは `apppad://workflow/install?id=<id>` を開きます。リンクに含まれるのは id だけです。AppPad はこのマーケットの署名付きインデックスをダウンロードして Ed25519 署名を確認し、ワークフローをダウンロードしてインデックスの SHA-256 と照合します。追加する前に、動作内容と必要な権限を表示します。リンクから別のファイルを読み込ませることはできません。

アップデートも同じです。「ワークフローのアップデートを確認」は、インストール済みのバージョンを署名付きインデックスと比較します。

## ライセンス

オープンソースではありません。各ワークフローの著作権は作者にあり、投稿すると YouMindHub がマーケット、youmindhub.com、AppPad を通じてホスト・配布することを許諾したことになります。それ以外のリポジトリの内容は © YouMindHub, all rights reserved. 正式な条件は英語版の [LICENSE.md](../../LICENSE.md) です。
