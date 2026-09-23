// Data loader kept separate from the page UI. It reads the catalog from the
// JSON file alongside this module.
const SOURCE = new URL('./hw-catalog.json', import.meta.url);

function findMatchingArrayEnd(text, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const character = text[index];

    if (inString) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
      continue;
    }

    if (character === '"') inString = true;
    else if (character === '[') depth += 1;
    else if (character === ']' && --depth === 0) return index + 1;
  }

  return -1;
}

// The catalog has, at times, contained repeated year blocks while it was being
// edited. Read each year array independently so one malformed outer object or
// duplicate key cannot prevent the current catalog from loading.
function parseCatalog(text) {
  const datasets = {};
  const yearPattern = /"(2024|2025|2026|2027)"\s*:\s*\[/g;
  let match;

  while ((match = yearPattern.exec(text))) {
    const arrayStart = text.indexOf('[', match.index);
    const arrayEnd = findMatchingArrayEnd(text, arrayStart);
    if (arrayEnd < 0) continue;

    try {
      datasets[match[1]] = JSON.parse(text.slice(arrayStart, arrayEnd));
    } catch {
      // Ignore an incomplete/invalid duplicate and keep the next valid block.
    }

    yearPattern.lastIndex = arrayEnd;
  }

  if (!Object.keys(datasets).length) {
    throw new Error('Unable to parse inventory catalog');
  }

  return datasets;
}

export async function loadDatasets() {
  const response = await fetch(`${SOURCE.href}?v=2`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Unable to load inventory catalog (${response.status})`);
  return parseCatalog(await response.text());
}
