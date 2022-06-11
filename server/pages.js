// import fs from 'fs/promises';
import express from 'express';
import baseHtml from '../client/base-html.js';

export default async function setupPages({ app, config, jwtReq }) {
  console.log({ config });

  const pages = [
    '/v1/ui',
    '/',
    '/login',
    '/e/:col',
    '/e/:col/:id',
    '/settings',
    '/definitions',
    '/users',
  ];

  app.get(pages, async (req, res) => {
    res.send(await baseHtml());
  });

  // REFACTOR: use URL API
  const publicPath = `${import.meta.url
    .replace('file://', '')
    .replace('server/pages.js', '')}.public`;
  console.log({ publicPath });
  app.use(express.static(publicPath));

  app.get('/info', jwtReq, (req, res) => {
    if (config) {
      res.send(config);
    } else {
      res.send({ success: false, msg: 'no config found' });
    }
  });
}
