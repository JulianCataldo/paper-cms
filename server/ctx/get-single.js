import fs from 'fs/promises';

export default function setupGetSingle({
  app,
  collectionName,
  validate,
  endpoint,
  jwtReq,
}) {
  app.get(`${endpoint}/:id`, jwtReq, async (req, res) => {
    const id = req.params['id'];
    // console.log({ id });
    const withRevisions = req.query['rev'] !== undefined ? true : false;

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

    if (entry) {
      // console.log({ entry });
      // res.send(withRevisions ? entry : entry[0]);
      res.send(entry);
    } else {
      console.log('Not found');
      res.status(404).send({ success: false, msg: 'Entry not found' });
    }
  });
}
