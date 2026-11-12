# Lingua Antiqua

Static study applications for Greek, Latin, and Biblical Hebrew. No build step:
open `index.html` in a browser or serve the folder with any static host.

## Layout

| Path | Purpose |
| --- | --- |
| `index.html`, `Greek.html`, `Latin.html`, `Hebrew.html` | Front page and one hub per language. Content is rendered from the manifest. |
| `GreekArticles.html`, `LatinPronouns.html` | Paradigm trainers (flashcards, quiz, paradigm table, matching). Each is a data file for `assets/paradigm.js`. |
| `GreekVocab.html` | Athenaze vocabulary, Chapters I to X. |
| `HebrewLetters.html`, `HebrewVowels.html` | Flashcard decks built on `assets/flashdeck.js`. |
| `HebrewVocab.html` | Biblical Hebrew vocabulary with graded lists and saved progress. |
| `assets/lingua.css` | Design tokens (light and dark) and every shared component. |
| `assets/lingua.js` | Site manifest, header, breadcrumb, footer, theme toggle, small utilities (`window.Lingua`). |
| `assets/paradigm.js` | Shared engine for case, gender, and number paradigms. |
| `assets/flashdeck.js` | Shared flip-card deck. |

## Adding an application

1. Copy an existing app page and set `data-section` and `data-app` on `<body>`.
2. Add one entry to that section's `apps` array in `SITE` (`assets/lingua.js`).

The navigation menu, language hub, and breadcrumb update automatically. To add a
language, add an object to `SITE.sections` and create a hub page (copy `Latin.html`
and change `data-section`).

## Theme

The site follows the operating system's light or dark preference. The toggle in the
header stores an override in `localStorage` under `lingua:theme`. Colours are tokens at
the top of `assets/lingua.css`; use `--gold-text` (not `--gold`) for text, since
`--gold` is decorative and does not meet contrast requirements on parchment.

## Saved data

All progress lives in the browser's `localStorage` (`athenaze_v1`, `hebvocab:known`,
`hebvocab:lists`, `lingua:theme`, `lingua:hebrew-font`). Nothing is sent anywhere.

## External requests

Fonts only, from Google Fonts. There are no script CDNs.
