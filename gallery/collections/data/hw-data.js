// Data loader kept separate from the page UI. It reads the original immutable
// catalog while the collection is migrated to a standalone JSON file.
const SOURCE = 'https://raw.githubusercontent.com/Geekcrowds/shirleyscastle/7187856a85e24dca9ebcf868349adc3616514d90/gallery/collections/hw.html';

export async function loadDatasets() {
  const response = await fetch(SOURCE, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Unable to load inventory catalog (${response.status})`);
  const source = await response.text();
  const match = source.match(/const DATASETS = (\{[\s\S]*?\n\});/);
  if (!match) throw new Error('Inventory catalog format was not recognised');
  return JSON.parse(match[1]);
}
