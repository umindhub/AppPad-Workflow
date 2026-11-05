# Einen Workflow einreichen

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

Jeder kann per Pull Request einen Workflow im AppPad Workflow-Markt veröffentlichen. Jede Einreichung wird automatisch geprüft und dann von einem Menschen gelesen, bevor sie online geht.

## 1. In AppPad schreiben und testen

Erstelle den Workflow in AppPad (Einstellungen › Workflows, oder lass ihn über den MCP-Server von AppPad von einem KI-Assistenten schreiben), führe ihn aus und exportiere ihn als JSON. Das Format steht in [docs/FORMAT.md](../FORMAT.md) (Englisch).

Wähle eine `id` unter einem Reverse-DNS-Präfix, das dir gehört, z. B. `io.github.deinname.diskfree`. `com.youmindhub.*` ist reserviert.

## 2. Einen Ordner anlegen

```
workflows/<id>/
  workflow.json   Pflicht — der exportierte Workflow (ein Objekt, kein Array)
  market.json     Pflicht — Angaben für den Eintrag, siehe unten
  icon.png        optional — quadratisches PNG, 512×512 empfohlen, höchstens 512 KB
```

Der Ordnername muss der `id` des Workflows entsprechen. Andere Dateien sind nicht erlaubt.

Entferne `icon` / `iconURL` aus `workflow.json`, bevor du einreichst; der Markt liefert `icon.png` aus und ergänzt `iconURL` selbst. Ohne Symbol zeichnet AppPad eines aus `symbol`.

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

| Feld | |
|---|---|
| `maintainers` | **Pflicht.** GitHub-Benutzernamen, die diesen Workflow aktualisieren oder entfernen dürfen. Deiner muss dabei sein. |
| `author.name` | **Pflicht.** Wird im Markt und in AppPad angezeigt. `author.url` (https) ist optional. |
| `categories` | **Pflicht**, 1–3, die Hauptkategorie zuerst: `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | Apps, mit denen er funktioniert, höchstens 10: Bundle-ID plus Name der App. Jede Bundle-ID aus `permissions.appleEvents` muss aufgeführt sein. Eine Bundle-ID findest du mit `osascript -e 'id of app "Finder"'`. |
| `tags` | Bis zu 8 Suchbegriffe: Kleinbuchstaben `a–z`, `0–9`, `-`, jeweils höchstens 24 Zeichen. |
| `example` | Was man im Workflow-Panel tippt, z. B. `timer 10`. |

Die Suche im Markt durchsucht auch Name, Beschreibung und `keywords` des Workflows in jeder übersetzten Sprache; Tags müssen also nur ergänzen, was dort noch nicht steht.

## 3. Einen Pull Request öffnen

Ein Workflow pro Pull Request. Die Prüfung sagt dir, was zu korrigieren ist: Format, Ordnerinhalt, ob du Maintainer bist und ob `version` erhöht wurde. Außerdem listet sie die Berechtigungen auf, die der Reviewer freigeben muss.

## Aktualisieren

Ändere die Dateien, erhöhe `version` in `workflow.json` (über die veröffentlichte Version) und öffne einen Pull Request. Das dürfen nur die Maintainer aus der veröffentlichten `market.json`. „Workflow-Updates prüfen“ in AppPad bietet allen, die ihn installiert haben, die neue Version an; braucht sie neue Berechtigungen, fragt AppPad erneut nach.

## Wann ein Workflow abgelehnt wird

- Berechtigungen, die er nicht braucht, oder keine Erklärung für die, die er verlangt.
- Verschleierter oder minifizierter Code, oder Code, der zur Laufzeit geladen und ausgeführt wird (`curl … | sh`).
- Daten sammeln oder senden, um die der Nutzer nicht gebeten hat.
- Selbstständig Befehle im Terminal ausführen. `prefillTerminal` ist in Ordnung: Der Nutzer drückt Return.
- Alles, was in [LICENSE.md](../../LICENSE.md) unter „Not allowed“ steht.

Mit der Einreichung stimmst du [LICENSE.md](../../LICENSE.md) zu (verbindlich ist der englische Text): Das Urheberrecht bleibt bei dir, und YouMindHub darf deinen Workflow über den Markt, youmindhub.com und AppPad bereitstellen und verbreiten.
