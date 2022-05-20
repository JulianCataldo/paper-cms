import fs from 'fs/promises';
import rwords from 'random-words';

export default function setupSave({
  app,
  collectionName,
  validate,
  endpoint,
  jwtReq,
}) {
  app.post(`${endpoint}/:id`, jwtReq, async (req, res) => {
    const paramId = req.params['id'];
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
    console.log({ paramId, entryObj });

    const valid = validate(entryObj);
    if (!valid) {
      console.log(validate.errors);
      res.status(400).send({ success: false, response: validate.errors });
    } else {
      const entryId =
        paramId === 'new' ? rwords(5).join('-') + '.json' : paramId;
      console.log({ body: req.body, post: endpoint, entryId });

      const path = process.env.DATA_DIR + `/docs/${collectionName}/${entryId}`;

      const revisions = [entryObj];

      if (paramId !== 'new') {
        await fs
          .readFile(path, 'utf8')
          .then((data) => {
            const obj = JSON.parse(data);
            const valid = validate(obj);
            if (!valid) {
              console.log(validate.errors);
            } else {
              revisions.push(...obj);
            }
          })
          .catch((data) => {
            console.log('error reading file');
          });
      }

      const revisionsSanitized = JSON.stringify(revisions, null, 2)
        .replace(/<.*script.*>(.*)<.*script.*>/g, '◎')
        .replace(/<.*href.*javascript:.*>.*<.*>/g, '◉');

      await fs
        .writeFile(path, revisionsSanitized)
        .then(() => {
          res.status(201).send({ success: true, response: { entryId } });
        })
        .catch(() => {
          res.status(400).send({ success: false, msg: 'cannot create file' });
        });
    }
  });
}
