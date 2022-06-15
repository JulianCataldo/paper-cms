import glob from 'glob-promise';
import path from 'path';
import fs from 'fs/promises';

export default function setupGetAll({
  app,
  collection,
  validate,
  endpoint,
  jwtReq,
}) {
  app.get(endpoint, jwtReq, async (req, res) => {
    const files = await glob(
      `${process.env.PAPER_DATA_DIR}/docs/${collection}/*`,
    );
    // console.log({ files });

    const promises = [];
    const entries = [];
    files.forEach((f) => {
      const reading = fs
        .readFile(f, 'utf8')
        .then((data) => {
          const entry = JSON.parse(data);
          const valid = validate(entry);
          if (!valid) {
            console.log(validate.errors);
          } else {
            const id = path.basename(f);
            entries.push({
              ...entry,
              _meta: { id, collection, ...entry._meta },
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
      promises.push(reading);
    });
    await Promise.all(promises);
    res.send(entries);
  });
}
