import fs from 'fs/promises';
import filterDeep from 'deepdash/filterDeep';
import yaml from 'js-yaml';

export default async function loadOpenApiConfig() {
  let input;
  let api;
  let uiSchemas;
  try {
    input = yaml.load(await fs.readFile('./models/api-v1.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  if (input) {
    api = filterDeep(input, (value, key /* parent */) => {
      if (key.startsWith('ui:')) {
        return false;
      }
      return true;
    });
    uiSchemas = filterDeep(input, (value, key /* parent */) => {
      if (key.startsWith('ui:')) {
        return true;
      }
      return false;
    }).components.schemas;
    // console.log(JSON.stringify({ api, uiSchemas }, null, 2));

    // generateTypesFromSchemas(api.components.schemas);

    return { api, uiSchemas };
  }
  return false;
}
