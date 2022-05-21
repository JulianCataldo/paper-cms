import glob from 'glob-promise';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

export default function setupAuth({ app, ajv, config }) {
  // const validateUser = ajv.compile({ $defs: config, ...config.User });
  app.post('/v1/login', async (req, res) => {
    console.log(req.body);

    const files = await glob(`${process.env.DATA_DIR}/docs/User/*`);
    console.log({ files });

    // const promises = [];
    // const entries = [];
    // files.forEach((f) => {
    //   const reading = fs
    //     .readFile(f, "utf8")
    //     .then((data) => {
    //       const obj = JSON.parse(data);
    //       const valid = validateUser(obj);
    //       if (!valid) {
    //         console.log(validateUser.errors);
    //       } else {
    //         const id = path.basename(f);
    //         entries.push({ _id: id, ...obj });
    //       }
    //     })
    //     .catch((data) => {
    //       console.log("error reading file");
    //     });
    //   promises.push(reading);
    // });
    // await Promise.all(promises);
    // console.log({ entries });

    if (
      req.body.userName === 'admin' &&
      req.body.password === process.env.ADMIN_PASSWORD
      // entries.find((e) => {
      //   e.userName === "admin"req.body.userName;
      // })
      // &&req.body.password === "az"
    ) {
      console.log('user found');
      const token = generateAccessToken({
        userName: req.body.userName,
        password: req.body.password,
      });

      console.log('login success');
      res.send(token);
    } else {
      console.log('login failed');
      res.status(401).send({ error: 'User not found' });
    }
  });

  function generateAccessToken(creds, illimited = false) {
    return jwt.sign(creds, process.env.TOKEN_SECRET, {
      ...(illimited ? {} : { expiresIn: '6600s' }),
    });
  }

  const frontToken = generateAccessToken(
    {
      userName: 'front',
      password: 'frontfrontfront',
    },
    true,
  );
  console.log('==PERMANENT JWT TOKEN for server side API use ONLY==');
  console.log({ frontToken });
  console.log('====================================================');

  return expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ['HS256'],
  });
}
