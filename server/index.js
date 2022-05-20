import express from 'express';
import dotenv from 'dotenv';

import mkdirp from 'mkdirp';

import fse from 'fs-extra';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { Server } from 'socket.io';
import http from 'http';

import loadOpenApiConfig from './config.js';

import setupUpload from './upload.js';
import setupAuth from './auth.js';
import setupPages from './pages.js';

import setupGetAll from './ctx/get-all.js';
import setupGetSingle from './ctx/get-single.js';
import setupSave from './ctx/save.js';
import setupDelete from './ctx/delete.js';

if (process.env.DEMO_MODE === 'true') {
  process.env.DATA_DIR = './.data-demo-fresh';
} else {
  process.env.DATA_DIR = process.env.DATA_DIR
    ? process.env.DATA_DIR + '/.data'
    : './.data';
}
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'top_secret';
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
process.env.PORT = process.env.PORT || 7777;
const PORT = process.env.PORT;

export default async function init() {
  console.log('Starting API…', process.cwd());

  dotenv.config();

  if (process.env.DEMO_MODE === 'true') {
    await setupDemoMode();
  }

  const app = express();
  app.use(express.json());

  const ajv = new Ajv();
  addFormats(ajv);

  const jwtReq = setupAuth({ app });

  const config = await loadOpenApiConfig();

  setupPages({ app, config, jwtReq });

  setupUpload({ app });

  for (const pathKey in config?.api?.paths) {
    const endpoint = `/v1/${pathKey}`;
    console.log({ post: endpoint });

    const validate = ajv.compile({
      $defs: config.api,
      ...config.api[pathKey],
    });

    mkdirp(process.env.DATA_DIR + '/docs/' + pathKey);

    const params = {
      app,
      collectionName: pathKey,
      validate,
      endpoint,
      jwtReq,
    };
    setupGetAll(params);
    setupGetSingle(params);
    setupSave(params);
    setupDelete(params);
  }
  const server = setupLiveReload(app);
  server.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}

init();

function setupLiveReload(app) {
  const server = new http.Server(app);
  const io = new Server(server);
  let inited = false;
  io.on('connection', (socket) => {
    io.emit('hello');
    if (!inited) {
      io.emit('reload');
      inited = true;
    }
    console.log(`Connected to client ${socket.id}`);
  });
  app.get('/reload', (req, res) => {
    console.log('/reload');
    io.emit('reload');
    res.send('reload');
  });
  return server;
}

async function setupDemoMode() {
  async function reset() {
    const srcDir = `./.data-demo`;
    const destDir = `./.data-demo-fresh`;
    await fse.copy(srcDir, destDir);
  }
  reset();

  setInterval(async () => {
    reset();
  }, 3600 * 1000 * 12);
}

// import { compile, compileFromFile } from 'json-schema-to-typescript';
// async function generateTypesFromSchemas(schemas) {
//   await mkdirp('./.build/types');

//   for (const schemaKey in schemas) {
//     compile({ $defs: schemas, ...schemas[schemaKey] }, schemaKey).then(
//       async (ts) => await fs.writeFile(`./.build/types/${schemaKey}.d.ts`, ts)
//     );
//   }
//   console.log({ s: schemas });
// }
