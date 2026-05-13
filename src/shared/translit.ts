export type TranslitMap = Map<string, string>;

export function parseMap(mapText: string): TranslitMap {
  const nextMap = new Map<string, string>();

  for (const rawLine of String(mapText).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = Array.from(line.slice(0, separatorIndex).trim())[0];
    const value = line.slice(separatorIndex + 1).trim();
    if (key) nextMap.set(key, value);
  }

  return nextMap;
}

export function transliterate(text: string, translitMap: TranslitMap): string {
  let result = '';

  for (const character of text) {
    result += translitMap.get(character) ?? character;
  }

  return result;
}
