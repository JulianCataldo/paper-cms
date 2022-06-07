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
// import git from './git.js';
import simpleGit from 'simple-git';
import setupAuth from './auth.js';
import setupPages from './pages.js';

import setupGetAll from './ctx/get-all.js';
import setupGetSingle from './ctx/get-single.js';
import setupSave from './ctx/save.js';
import setupDelete from './ctx/delete.js';

const MODE = process.env.MODE || 'local';
const env = `${process.cwd()}/.env.${MODE}`;
dotenv.config({ path: env });

if (process.env.PAPER_DEMO_MODE === 'true') {
  process.env.PAPER_DATA_DIR = './.data-demo-fresh';
} else {
  process.env.PAPER_DATA_DIR =
    process.env.PAPER_DATA_DIR || `${process.cwd()}/.data`;
}
process.env.PAPER_TOKEN_SECRET = process.env.PAPER_TOKEN_SECRET || 'top_secret';
process.env.PAPER_ADMIN_PASSWORD =
  process.env.PAPER_ADMIN_PASSWORD || 'password';
process.env.PAPER_PORT = process.env.PAPER_PORT || 7777;
const { PAPER_PORT } = process.env;

process.env.PAPER_STANDALONE = process.env.PAPER_STANDALONE || 'true';

export default async function init() {
  console.log('Starting API…', process.cwd());
  console.log(`MODE: ${MODE}`);

  if (process.env.PAPER_DEMO_MODE === 'true') {
    console.log('Demo mode activated…');
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

    await mkdirp(process.env.PAPER_DATA_DIR + '/docs/' + pathKey);

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
  console.log('Copying demo files…');
  async function reset() {
    const srcDir = './.data-demo';
    const destDir = './.data-demo-fresh';
    await fse
      .copy(srcDir, destDir)
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  reset();

  // setInterval(async () => {
  //   reset();
  // }, 3600 * 1000 * 12);
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
