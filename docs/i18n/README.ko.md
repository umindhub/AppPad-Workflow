# AppPad 워크플로 마켓

[English](../../README.md) · [简体中文](README.zh-Hans.md) · [繁體中文](README.zh-Hant.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Nederlands](README.nl.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Français](README.fr.md) · [Italiano](README.it.md)

[AppPad](https://youmindhub.com/i/apppad) 워크플로 패널(⌘스페이스)에서 쓰는 워크플로를 이 저장소에서 공개합니다. **[youmindhub.com/i/apppad/workflows](https://youmindhub.com/i/apppad/workflows)**에서 둘러보세요.

## 제출하기

`workflows/<id>/`에 폴더 하나를 추가해 pull request를 여세요. 먼저 [CONTRIBUTING](CONTRIBUTING.ko.md)을 읽어 주세요. `workflow.json` 형식은 [docs/FORMAT.md](../FORMAT.md)(영어)에 있습니다.

## 설치 방식

웹사이트의 설치 버튼은 `apppad://workflow/install?id=<id>`를 엽니다. 링크에는 id만 들어 있습니다. AppPad는 이 마켓의 서명된 인덱스를 내려받아 Ed25519 서명을 확인하고, 워크플로를 내려받아 인덱스의 SHA-256과 대조한 뒤, 추가하기 전에 하는 일과 요청하는 권한을 보여 줍니다. 링크로 다른 파일을 내려받게 할 수는 없습니다.

업데이트도 같습니다. '워크플로 업데이트 확인'은 설치된 버전을 서명된 인덱스와 비교합니다.

## 라이선스

오픈 소스가 아닙니다. 각 워크플로의 저작권은 작성자에게 있으며, 제출하면 YouMindHub가 마켓, youmindhub.com, AppPad를 통해 호스팅하고 배포하는 것을 허락하게 됩니다. 저장소의 나머지 내용은 © YouMindHub, all rights reserved. 정식 조건은 영어판 [LICENSE.md](../../LICENSE.md)를 따릅니다.
