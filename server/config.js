import fs from 'fs/promises';
import filterDeep from 'deepdash/filterDeep';
import yaml from 'js-yaml';

import { compile } from 'json-schema-to-typescript';
import glob from 'glob-promise';
import _ from 'lodash-es';

export default async function loadOpenApiConfig() {
  let api;
  let uiSchemas;

  const input = { paths: {}, components: { schemas: {} } };

  try {
    const files = await glob('./models/**/*.yaml');

    await Promise.all(
      files.map(async (filePath) => {
        const p = filePath.split('/').slice(2);
        const last = p[p.length - 1];
        if (last.startsWith('_')) {
          p.pop();
        }
        p[p.length - 1] = p[p.length - 1].replace('.yaml', '');
        const thePath = p.join('.');
        _.set(input.paths, thePath, '');
        const def = yaml.load(await fs.readFile(filePath, 'utf8'));
        input.components.schemas = { ...input.components.schemas, ...def };
      }),
    );

    console.log({ files, data: JSON.stringify(input, null, 2) });

    // input = yaml.load(await fs.readFile(path, 'utf8'));
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
