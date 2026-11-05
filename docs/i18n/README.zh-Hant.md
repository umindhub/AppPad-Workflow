# AppPad 工作流程市集

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

[AppPad](https://youmindhub.com/i/apppad) 工作台（⌘空白鍵）的工作流程，從這個儲存庫發佈。在 **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)** 瀏覽。

## 投稿

提交一個 pull request，內容是 `workflows/<id>/` 下的一個資料夾。先讀 [CONTRIBUTING](CONTRIBUTING.zh-Hant.md)，`workflow.json` 的格式見 [docs/FORMAT.md](../FORMAT.md)（英文）。

## 安裝流程

網站上的「安裝」按鈕會打開 `apppad://workflow/install?id=<id>`，連結裡只有 id。AppPad 下載本市集簽署過的索引，驗證 Ed25519 簽章，再下載工作流程並依索引中的 SHA-256 驗證，加入前會顯示它做什麼、要哪些權限。連結無法讓 AppPad 下載其他任何檔案。

更新也一樣：「檢查工作流程更新」會拿已安裝的版本和簽署索引比較。

## 授權

本儲存庫不是開源專案。每個工作流程的著作權歸其作者所有；投稿即授權 YouMindHub 透過工作流程市集、youmindhub.com 和 AppPad 託管與散佈。儲存庫中其餘內容 © YouMindHub，保留所有權利。完整條款以英文版 [LICENSE.md](../../LICENSE.md) 為準。
