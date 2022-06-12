import fs from 'fs/promises';
import filterDeep from 'deepdash/filterDeep';
import yaml from 'js-yaml';

import { compile } from 'json-schema-to-typescript';

export default async function loadOpenApiConfig() {
  let input;
  let api;
  let uiSchemas;
  try {
    const path = `${import.meta.url
      .replace('file://', '')
      .replace('server/config.js', '')}models/api-v1.yaml`;
    input = yaml.load(await fs.readFile(path, 'utf8'));
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

    compile({ $defs: api.components.schemas }, 'AllDefs', {
      unreachableDefinitions: true,
    }).then((result) => {
      fs.writeFile('./models/types.ts', result);
      // console.log(result);
    });

    return { api, uiSchemas };
  }
  return false;
}
