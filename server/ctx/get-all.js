import glob from 'glob-promise';
import path from 'path';
import fs from 'fs/promises';

export default function setupGetAll({
  app,
  collectionName,
  validate,
  endpoint,
  jwtReq,
}) {
  app.get(endpoint, jwtReq, async (req, res) => {
    const files = await glob(
      process.env.DATA_DIR + `/docs/${collectionName}/*`
    );
    console.log({ files });

    const promises = [];
    const entries = [];
    files.forEach((f) => {
      const reading = fs
        .readFile(f, 'utf8')
        .then((data) => {
          const entryRevisions = JSON.parse(data);
          const valid = validate(entryRevisions[0]);
          if (!valid) {
            console.log(validate.errors);
          } else {
            const id = path.basename(f);
            entries.push({ _id: id, ...entryRevisions[0] });
          }
        })
        .catch((data) => {
          console.log('error reading file');
        });
      promises.push(reading);
    });
    await Promise.all(promises);
    res.send(entries);
  });
}
