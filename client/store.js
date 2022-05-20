import axios from 'axios';

let conf = { paths: [] };
const headers = {
  Authorization: 'Bearer ' + localStorage.getItem('jwt'),
};

async function initConf() {
  let loggedIn = false;
  await axios
    .get('/info', { headers })
    .then((e) => {
      conf = e.data;
      loggedIn = true;
    })
    .catch((e) => {
      loggedIn = false;
      console.log('no config found');
    });
  return loggedIn;
}

export { initConf, conf, headers };
