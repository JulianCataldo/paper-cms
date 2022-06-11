import express from 'express';
import dotenv from 'dotenv';

import mkdirp from 'mkdirp';

import fs from 'fs/promises';
import fse from 'fs-extra';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { Server } from 'socket.io';
import http from 'http';

import simpleGit from 'simple-git';
import loadOpenApiConfig from './config.js';

import setupUpload from './upload.js';
// import git from './git.js';
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

  async function traverse(obj) {
    for (const pathKey in obj) {
      const endpoint = `/v1/${pathKey}`;
      console.log({ post: endpoint });

      const validate = ajv.compile({
        $defs: config.api,
        ...config.api[pathKey],
      });

      // eslint-disable-next-line no-await-in-loop
      await mkdirp(`${process.env.PAPER_DATA_DIR}/docs/${pathKey}`);

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

      if (typeof obj[pathKey] === 'object') {
        traverse(obj[pathKey]);
      }
    }
  }
  await traverse(config?.api?.paths);

  const server = setupLiveReload(app);
  await new Promise((resolve) => {
    server.listen(PAPER_PORT, () => {
      console.log(
        `[server]: Server is running at http://localhost:${PAPER_PORT}`,
      );
      resolve();
    });
  });

  setupGit();
}

if (process.env.PAPER_STANDALONE === 'true') {
  init();
}

async function setupGit() {
  await fs
    .writeFile(`${process.env.PAPER_DATA_DIR}/.gitignore`, 'bin/*')
    .catch((e) => console.log(e));

  const git = simpleGit(process.env.PAPER_DATA_DIR);
  await git.init();
  await git.addConfig('user.name', 'PCMS_Admin');
  await git.addConfig('user.email', 'admin@admin.xyz');

  await git.log().catch((e) => console.log(e));
  // .then((r) => console.log({ r: r?.all }));
}

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
