// SPDX-License-Identifier: GPL-2.0-or-later

/** A parsed gettext catalogue: English source string to translation. */
export type Messages = Record<string, string>;

function unquote(line: string): string {
  const body = line.trim().slice(1, -1);
  return body.replace(/\\(n|t|"|\\)/g, (_, c: string) => (c === "n" ? "\n" : c === "t" ? "\t" : c));
}

/**
 * Parse the subset of gettext .po syntax the PhotoCollage translation files
 * use: msgid/msgstr pairs with continuation lines. Fuzzy entries, plural forms
 * and empty translations are ignored, as are the header and all comments.
 */
export function parsePo(source: string): Messages {
  const messages: Messages = {};
  let id: string | null = null;
  let str: string | null = null;
  let target: "id" | "str" | null = null;
  let fuzzy = false;
  let pendingFuzzy = false;

  const flush = () => {
    if (id !== null && str !== null && id !== "" && str !== "" && !fuzzy) messages[id] = str;
    id = str = target = null;
    fuzzy = false;
  };

  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith("#,")) {
      if (line.includes("fuzzy")) pendingFuzzy = true;
    } else if (line.startsWith("#")) {
    } else if (line.startsWith("msgid_plural") || line.startsWith("msgstr[")) {
      target = null;
    } else if (line.startsWith("msgid ")) {
      flush();
      fuzzy = pendingFuzzy;
      pendingFuzzy = false;
      id = unquote(line.slice(6));
      target = "id";
    } else if (line.startsWith("msgstr ")) {
      str = unquote(line.slice(7));
      target = "str";
    } else if (line.startsWith('"')) {
      if (target === "id" && id !== null) id += unquote(line);
      else if (target === "str" && str !== null) str += unquote(line);
    } else if (line === "") {
      flush();
    }
  }
  flush();
  return messages;
}
