import fs from 'fs/promises';

export default function setupDelete({
  app,
  collection,
  validate,
  endpoint,
  jwtReq,
}) {
  app.delete(`${endpoint}/:id`, jwtReq, async (req, res) => {
    const { id } = req.params;

    console.log(id);
    const restoreMode = !!req.query.restore;

    console.log(restoreMode);

    const entry = await fs
      .readFile(
        `${process.env.PAPER_DATA_DIR}/docs/${collection}/${id}`,
        'utf8',
      )
      .then((data) => {
        const obj = JSON.parse(data);
        const valid = validate(obj);
        if (!valid) {
          console.log(validate.errors);
          return false;
        }
        return obj;
      })
      .catch((e) => {
        console.log(e);
      });

    if (restoreMode) {
      delete entry?._meta?.deleted;
    } else {
      entry._meta.deleted = new Date().toISOString();
    }

    const path = `${process.env.PAPER_DATA_DIR}/docs/${collection}/${id}`;
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
