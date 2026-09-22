// Data loader kept separate from the page UI. It reads the catalog from the
// JSON file alongside this module.
const SOURCE = new URL('./hw-catalog.json', import.meta.url);

export async function loadDatasets() {
  const response = await fetch(SOURCE, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Unable to load inventory catalog (${response.status})`);
  return response.json();
}
