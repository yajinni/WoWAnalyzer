const fs = require('fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}
function reformat(json) {
  return json.realms.map(({ name, slug }) => ({
    name,
    slug,
  })).sort((a, b) => a.name.localeCompare(b.name));
}
function reformatFile(path) {
  return reformat(readJson(path));
}

const output = {
  EU: reformatFile('./data/EU.json'),
  KR: reformatFile('./data/KR.json'),
  TW: reformatFile('./data/TW.json'),
  US: reformatFile('./data/US.json'),
  CN: reformatFile('./data/CN.json'),
};

fs.writeFileSync(
  './output.js',
  `// Generated file, changes will be overwritten!
// eslint-disable

export default ${JSON.stringify(output)};
`,
);
