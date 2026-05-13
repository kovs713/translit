# Cyrillic Input Translit

WXT + TypeScript browser extension that rewrites only typed Cyrillic text inside editable fields. Existing page text is not translated.

## Install

```sh
bun install
```

## Run Firefox Dev

```sh
bun dev:firefox
```

## Build Firefox

```sh
bun build:firefox
```

## Usage

- Open a page with an editable field, such as Twitch chat, an `input`, a `textarea`, or `[contenteditable]`.
- Click the extension toolbar icon to show the floating panel.
- Enable `Active`.
- Type or paste Cyrillic text into the page field.
- Edit the map in the panel to change rules. Changes persist in `browser.storage.local`.
- Click `Hide` to close the panel. Click the toolbar icon to show it again.

## Map Syntax

One rule per line:

```txt
а=a
б=6
ъ=
```

- Left side is the source character.
- Right side is the replacement text.
- Empty right side deletes that character.
- Characters not present in the map are preserved.

## Scripts

```sh
pnpm typecheck
pnpm build:firefox
```
