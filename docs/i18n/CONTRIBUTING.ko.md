# 워크플로 제출하기

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

누구나 pull request로 AppPad 워크플로 마켓에 워크플로를 공개할 수 있습니다. 모든 제출물은 자동 검사 후 사람이 읽어 본 다음 공개됩니다.

## 1. AppPad에서 만들고 테스트하기

AppPad에서 워크플로를 만들고(설정 › 워크플로, 또는 AppPad의 MCP 서버를 통해 AI 어시스턴트에게 요청), 실행해 본 뒤 JSON으로 내보내세요. 형식은 [docs/FORMAT.md](../FORMAT.md)(영어)에 있습니다.

`id`는 직접 관리하는 역방향 도메인 접두사를 쓰세요(예: `io.github.yourname.diskfree`). `com.youmindhub.*`는 예약되어 있습니다.

## 2. 폴더 추가하기

```
workflows/<id>/
  workflow.json   필수 — 내보낸 워크플로(배열이 아닌 객체 하나)
  market.json     필수 — 등록 정보, 아래 참고
  icon.png        선택 — 정사각형 PNG, 512×512 권장, 512 KB 이하
```

폴더 이름은 워크플로의 `id`와 같아야 하며, 다른 파일은 넣을 수 없습니다.

제출 전에 `workflow.json`에서 `icon` / `iconURL`을 지우세요. 마켓이 `icon.png`를 제공하고 `iconURL`을 자동으로 채웁니다. 아이콘이 없으면 AppPad가 `symbol`로 그립니다.

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

| 필드 | |
|---|---|
| `maintainers` | **필수.** 이 워크플로를 업데이트하거나 삭제할 수 있는 GitHub 사용자 이름. 본인을 포함해야 합니다. |
| `author.name` | **필수.** 마켓과 AppPad에 표시됩니다. `author.url`(https)은 선택입니다. |
| `categories` | **필수**, 1–3개, 주 카테고리를 맨 앞에: `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | 함께 쓰는 앱, 최대 10개. 잘 알려진 이름으로 적으세요(`Finder`, `Safari`, `Photoshop`). 페이지에 표시되고 검색과 앱 필터에 쓰입니다. |
| `tags` | 영어 검색어 최대 8개: 소문자 `a–z`, `0–9`, `-`, 각각 24자 이하. 번역은 `localizations`에 적습니다. |
| `example` | 워크플로 패널에 입력할 내용, 예: `timer 10`. |
| `localizations` | 선택, 언어별(`zh-Hans`, `zh-Hant`, `ja`, `ko`, `nl`, `de`, `es`, `fr`, `it`): `apps`와 `tags`에 영어 이름마다 번역을 지정합니다. 번역이 없는 항목은 영어로 표시됩니다. 카테고리 이름은 마켓이 번역합니다. |

마켓 검색은 번역된 모든 언어의 이름, 설명, `keywords`도 함께 찾으므로, 태그에는 거기에 없는 단어만 넣으면 됩니다.

## 3. pull request 열기

pull request 하나에 워크플로 하나만 넣어 주세요. 검사 결과가 형식, 폴더 내용, 메인테이너 여부, `version` 상향 여부 등 고칠 점을 알려 줍니다. 검토자가 승인해야 할 권한도 보여 줍니다.

## 업데이트

파일을 수정하고 `workflow.json`의 `version`을 공개된 버전보다 높인 뒤 pull request를 여세요. 공개된 `market.json`에 있는 메인테이너만 할 수 있습니다. AppPad의 '워크플로 업데이트 확인'이 설치한 모든 사용자에게 새 버전을 제공하며, 새 권한이 필요하면 AppPad가 사용자에게 다시 묻습니다.

## 거절되는 경우

- 필요 없는 권한을 요청하거나, 요청하는 권한에 대한 설명이 없음.
- 난독화·압축된 코드, 또는 실행 중에 내려받아 실행하는 코드(`curl … | sh`).
- 사용자가 요청하지 않은 정보를 수집하거나 전송함.
- 스스로 터미널 명령을 실행함. `prefillTerminal`은 괜찮습니다(사용자가 Return을 누름).
- [LICENSE.md](../../LICENSE.md)의 'Not allowed'에 있는 모든 것.

제출하면 [LICENSE.md](../../LICENSE.md)(영어판 기준)에 동의하는 것입니다. 저작권은 본인에게 있으며, YouMindHub는 마켓, youmindhub.com, AppPad를 통해 워크플로를 호스팅하고 배포할 수 있습니다.
