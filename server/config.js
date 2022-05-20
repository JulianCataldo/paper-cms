import fs from 'fs/promises';
import filterDeep from 'deepdash/filterDeep';
import yaml from 'js-yaml';

export default async function loadOpenApiConfig() {
  let input, api, uiSchemas;
  try {
    input = yaml.load(await fs.readFile('./models/api-v1.yaml', 'utf8'));
  } catch (e) {
    console.log(e);
  }
  if (input) {
    api = filterDeep(input, (value, key, parent) => {
      if (key.startsWith('ui:')) {
        return false;
      } else {
        return true;
      }
    });
    uiSchemas = filterDeep(input, (value, key, parent) => {
      if (key.startsWith('ui:')) {
        return true;
      } else {
        return false;
      }
    }).components.schemas;
    // console.log(JSON.stringify({ api, uiSchemas }, null, 2));

    // generateTypesFromSchemas(api.components.schemas);

    return { api, uiSchemas };
  } else {
    return false;
  }
}
