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
    const withRevisions = req.query['rev'] !== undefined ? true : false;

    const entryRevisions = await fs
      .readFile(process.env.DATA_DIR + `/docs/${collectionName}/${id}`, 'utf8')
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

    console.log({ entryRevisions });
    res.send(withRevisions ? entryRevisions : entryRevisions[0]);
  });
}
