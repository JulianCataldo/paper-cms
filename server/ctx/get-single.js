import fs from 'fs/promises';

export default function setupGetSingle({
  app,
  collection,
  validate,
  endpoint,
  jwtReq,
}) {
  app.get(`${endpoint}/:id`, jwtReq, async (req, res) => {
    const { id } = req.params;
    // console.log({ id });
    // const withRevisions = req.query.rev !== undefined;

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

    if (entry) {
      // console.log({ entry });
      // res.send(withRevisions ? entry : entry[0]);
      const entryWithMeta = {
        ...entry,
        _meta: { id, collection, ...entry._meta },
      };
      res.send(entryWithMeta);
    } else {
      console.log('Not found');
      res.status(404).send({ success: false, msg: 'Entry not found' });
    }
  });
}
