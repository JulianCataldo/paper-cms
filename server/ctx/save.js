import fs from 'fs/promises';
import rwords from 'random-words';
// import git from '../git.js';
import simpleGit from 'simple-git';

export default function setupSave({
  app,
  collection,
  validate,
  endpoint,
  jwtReq,
}) {
  app.post(`${endpoint}/:id`, jwtReq, async (req, res) => {
    const paramId = req.params.id;
    const dateActionOverride = paramId === 'new' ? 'created' : 'updated';
    const entryObj = {
      ...req.body,
      _meta: {
        created: req.body._meta?.created,
        updated: req.body._meta?.updated,
        deleted: req.body._meta?.deleted,
        [dateActionOverride]: new Date().toISOString(),
      },
    };
    // console.log({ paramId, entryObj });

    const valid = validate(entryObj);
    if (!valid) {
      console.log(validate.errors);
      res.status(400).send({ success: false, response: validate.errors });
    } else {
      const entryId =
        paramId === 'new' ? `${rwords(5).join('-')}.json` : paramId;
      // console.log({ body: req.body, post: endpoint, entryId });

      const path = `${process.env.PAPER_DATA_DIR}/docs/${collection}/${entryId}`;

      const entryObjOrdered = Object.keys(entryObj)
        .sort()
        .reduce((obj, key) => {
          obj[key] = entryObj[key];
          return obj;
        }, {});

      const entryObjSanitized = JSON.stringify(entryObjOrdered, null, 2)
        .replace(/<.*script.*>(.*)<.*script.*>/g, '◎')
        .replace(/<.*href.*javascript:.*>.*<.*>/g, '◉');

      await fs
        .writeFile(path, entryObjSanitized)
        .then(async () => {
          console.log('Committing');
          const git = simpleGit(process.env.PAPER_DATA_DIR);

          await git.add('.').catch((e) => console.log(e));
          const user = req.auth.userName;
          await git
            .commit(
              `💾 #Save ( @${user} ) [${collection}] [${entryId}]`,
              // /${collection}/${entryId}`
            )
            .catch((e) => console.log(e));

          res.status(201).send({ success: true, response: { entryId } });
        })
        .catch(() => {
          res.status(400).send({ success: false, msg: 'cannot create file' });
        });
    }
  });
}
