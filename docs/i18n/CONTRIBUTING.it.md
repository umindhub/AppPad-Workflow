# Inviare un flusso

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

Chiunque può pubblicare un flusso nel Mercato dei flussi di AppPad con una pull request. Ogni invio viene controllato automaticamente e poi letto da una persona prima di andare online.

## 1. Scrivilo e provalo in AppPad

Crea il flusso in AppPad (Impostazioni › Flussi, oppure chiedi a un assistente IA tramite il server MCP di AppPad), eseguilo, poi esportalo in JSON. Il formato è in [docs/FORMAT.md](../FORMAT.md) (in inglese).

Scegli un `id` con un prefisso DNS inverso che controlli tu, per esempio `io.github.tuonome.diskfree`. `com.youmindhub.*` è riservato.

## 2. Aggiungi una cartella

```
workflows/<id>/
  workflow.json   obbligatorio — il flusso esportato (un oggetto, non un array)
  market.json     obbligatorio — dati della scheda, vedi sotto
  icon.png        facoltativo — PNG quadrato, consigliato 512×512, al massimo 512 KB
```

Il nome della cartella deve coincidere con l’`id` del flusso. Non sono ammessi altri file.

Rimuovi `icon` / `iconURL` da `workflow.json` prima dell’invio; il mercato fornisce `icon.png` e compila `iconURL` al posto tuo. Senza icona, AppPad ne disegna una a partire da `symbol`.

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

| Campo | |
|---|---|
| `maintainers` | **Obbligatorio.** Utenti GitHub che possono aggiornare o rimuovere questo flusso. Deve includere il tuo. |
| `author.name` | **Obbligatorio.** Mostrato nel mercato e in AppPad. `author.url` (https) è facoltativo. |
| `categories` | **Obbligatorio**, da 1 a 3, la principale per prima: `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | App con cui funziona, al massimo 10, con il nome che tutti conoscono (`Finder`, `Safari`, `Photoshop`). Mostrate nella pagina e usate per la ricerca e il filtro per app. |
| `tags` | Fino a 8 parole di ricerca in inglese: minuscole `a–z`, `0–9`, `-`, al massimo 24 caratteri ciascuna. Le traduzioni vanno in `localizations`. |
| `example` | Cosa digitare nel pannello dei flussi, per esempio `timer 10`. |
| `localizations` | Facoltativo, per lingua (`zh-Hans`, `zh-Hant`, `ja`, `ko`, `nl`, `de`, `es`, `fr`, `it`): `apps` e `tags` associano a ogni nome inglese la sua traduzione. Ciò che manca viene mostrato in inglese. I nomi delle categorie li traduce il mercato. |

La ricerca del mercato copre anche nome, descrizione e `keywords` del flusso in ogni lingua in cui è tradotto, quindi i tag devono solo aggiungere ciò che lì non c’è già.

## 3. Apri una pull request

Un flusso per pull request. Il controllo ti dice cosa correggere: formato, contenuto della cartella, se sei maintainer e se `version` è aumentata. Elenca anche i permessi che il revisore deve approvare.

## Aggiornare

Modifica i file, aumenta `version` in `workflow.json` (sopra quella pubblicata) e apri una pull request. Possono farlo solo i maintainer del `market.json` pubblicato. «Cerca aggiornamenti dei flussi» di AppPad propone la nuova versione a tutti quelli che l’hanno installato; se chiede nuovi permessi, AppPad lo chiede di nuovo all’utente.

## Motivi di rifiuto

- Permessi non necessari, o nessuna spiegazione per quelli richiesti.
- Codice offuscato, minificato, o scaricato ed eseguito al momento (`curl … | sh`).
- Raccogliere o inviare qualcosa che l’utente non ha chiesto.
- Eseguire comandi nel Terminale da solo. `prefillTerminal` va bene: l’utente preme Invio.
- Qualsiasi cosa elencata in «Not allowed» in [LICENSE.md](../../LICENSE.md).

Inviando accetti [LICENSE.md](../../LICENSE.md) (fa fede il testo inglese): il diritto d’autore resta tuo, e YouMindHub può ospitare e distribuire il tuo flusso tramite il mercato, youmindhub.com e AppPad.
