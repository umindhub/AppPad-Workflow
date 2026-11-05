# Proposer un flux

[English](../../CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh-Hans.md) · [繁體中文](CONTRIBUTING.zh-Hant.md) · [日本語](CONTRIBUTING.ja.md) · [한국어](CONTRIBUTING.ko.md) · [Nederlands](CONTRIBUTING.nl.md) · [Deutsch](CONTRIBUTING.de.md) · [Español](CONTRIBUTING.es.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md)

Tout le monde peut publier un flux dans le Marché des flux AppPad avec une pull request. Chaque proposition est vérifiée automatiquement, puis lue par une personne avant sa mise en ligne.

## 1. Écrivez-le et testez-le dans AppPad

Créez le flux dans AppPad (Réglages › Flux, ou demandez à un assistant IA via le serveur MCP d’AppPad), exécutez-le, puis exportez-le en JSON. Le format est décrit dans [docs/FORMAT.md](../FORMAT.md) (en anglais).

Choisissez un `id` sous un préfixe DNS inversé qui vous appartient, par exemple `io.github.votrenom.diskfree`. `com.youmindhub.*` est réservé.

## 2. Ajoutez un dossier

```
workflows/<id>/
  workflow.json   obligatoire — le flux exporté (un objet, pas un tableau)
  market.json     obligatoire — informations de la fiche, voir ci-dessous
  icon.png        facultatif — PNG carré, 512×512 recommandé, 512 Ko au maximum
```

Le nom du dossier doit être identique à l’`id` du flux. Aucun autre fichier n’est accepté.

Retirez `icon` / `iconURL` de `workflow.json` avant de proposer le flux ; le marché sert `icon.png` et renseigne `iconURL` pour vous. Sans icône, AppPad en dessine une à partir de `symbol`.

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

| Champ | |
|---|---|
| `maintainers` | **Obligatoire.** Identifiants GitHub autorisés à mettre à jour ou retirer ce flux. Le vôtre doit en faire partie. |
| `author.name` | **Obligatoire.** Affiché dans le marché et dans AppPad. `author.url` (https) est facultatif. |
| `categories` | **Obligatoire**, 1 à 3, la principale en premier : `productivity`, `system`, `developer`, `files`, `text`, `web`, `network`, `media`, `communication`, `design`, `ai`, `other`. |
| `apps` | Apps avec lesquelles il fonctionne, 10 au maximum, sous leur nom courant (`Finder`, `Safari`, `Photoshop`). Affichées sur la page et utilisées pour la recherche et le filtre par app. |
| `tags` | Jusqu’à 8 mots de recherche en anglais : minuscules `a–z`, `0–9`, `-`, 24 caractères au maximum chacun. Les traductions vont dans `localizations`. |
| `example` | Ce qu’on tape dans le panneau des flux, par exemple `timer 10`. |
| `localizations` | Facultatif, par langue (`zh-Hans`, `zh-Hant`, `ja`, `ko`, `nl`, `de`, `es`, `fr`, `it`) : `apps` et `tags` associent chaque nom anglais à sa traduction. Ce qui manque s’affiche en anglais. Les noms de catégories sont traduits par le marché. |

La recherche du marché porte aussi sur le nom, la description et les `keywords` du flux dans chaque langue traduite : les tags n’ont donc qu’à compléter ce qui n’y figure pas déjà.

## 3. Ouvrez une pull request

Un flux par pull request. La vérification indique ce qu’il faut corriger : format, contenu du dossier, si vous êtes maintainer et si `version` a augmenté. Elle liste aussi les autorisations que le relecteur doit approuver.

## Mettre à jour

Modifiez les fichiers, augmentez `version` dans `workflow.json` (au-dessus de la version publiée) et ouvrez une pull request. Seuls les maintainers du `market.json` publié peuvent le faire. « Rechercher des mises à jour des flux » dans AppPad propose la nouvelle version à tous ceux qui l’ont installé ; si elle demande de nouvelles autorisations, AppPad redemande à l’utilisateur.

## Motifs de refus

- Des autorisations inutiles, ou aucune explication pour celles demandées.
- Du code obscurci, minifié, ou téléchargé puis exécuté à la volée (`curl … | sh`).
- Collecter ou envoyer quoi que ce soit que l’utilisateur n’a pas demandé.
- Exécuter seul des commandes dans le Terminal. `prefillTerminal` est accepté : l’utilisateur appuie sur Retour.
- Tout ce qui figure sous « Not allowed » dans [LICENSE.md](../../LICENSE.md).

En proposant un flux, vous acceptez [LICENSE.md](../../LICENSE.md) (seul le texte anglais fait foi) : vous conservez vos droits d’auteur, et YouMindHub peut héberger et distribuer votre flux via le marché, youmindhub.com et AppPad.
