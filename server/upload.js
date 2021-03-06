import sharp from 'sharp';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import multer from 'multer';

export default function setupUpload({ app }) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `${process.env.PAPER_DATA_DIR}/bin/`);
    },
    filename(req, file, cb) {
      const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniquePrefix}_${file.originalname}`);
    },
  });

  mkdirp(`${process.env.PAPER_DATA_DIR}/bin/resized/`);

  app.get('/media/:file', async function getMedia(req, res) {
    const width = req.query.w || 'o';

    const resizedFilePath = `${process.env.PAPER_DATA_DIR}/bin/resized/w${width}_${req.params.file}`;

    const ext = path.extname(req.params.file).substring(1);
    res.set('Content-Type', `image/${ext}`);

    if (fsSync.existsSync(resizedFilePath)) {
      console.log('resized exists');
      const fileContent = await fs.readFile(resizedFilePath);
      res.send(fileContent);
    } else {
      console.log('resizing…');
      const fileContent = await fs.readFile(
        `${process.env.PAPER_DATA_DIR}/bin/${req.params.file}`,
      );
      const size = [parseInt(width, 10) || null, null];
      const fileResized = await sharp(fileContent)
        .resize(size[0], size[1], { withoutEnlargement: true })
        .toBuffer();
      res.send(fileResized);
      fs.writeFile(resizedFilePath, fileResized);
    }
  });

  const upload = multer({ storage });

  app.post('/v1/upload', upload.single('media'), (req, res /* next */) => {
    console.log(req.file);
    res.send({ success: true, url: `/media/${req.file.filename}` });
  });
}
