import fs from 'fs/promises';

export default function setupDelete({
  app,
  collectionName,
  validate,
  endpoint,
  jwtReq,
}) {
  app.delete(`${endpoint}/:id`, jwtReq, async (req, res) => {
    const id = req.params['id'];

    console.log(id);
    const restoreMode = req.query['restore'] ? true : false;

    console.log(restoreMode);

    const entry = await fs
      .readFile(
        process.env.PAPER_DATA_DIR + `/docs/${collectionName}/${id}`,
        'utf8',
      )
      .then((data) => {
        const obj = JSON.parse(data);
        const valid = validate(obj);
        if (!valid) {
          console.log(validate.errors);
        } else {
          return obj;
        }
      })
      .catch((data) => {
        console.log('error reading file');
      });

    if (restoreMode) {
      delete entry?._meta?.deleted;
    } else {
      entry._meta.deleted = new Date().toISOString();
    }

    const path = process.env.PAPER_DATA_DIR + `/docs/${collectionName}/${id}`;
    await fs
      .writeFile(path, JSON.stringify(entry, null, 2))
      .then(() => {
        res.status(201).send({ success: true, response: { id } });
      })
      .catch(() => {
        res.status(400).send({ success: false, msg: 'cannot create file' });
      });
  });
}
