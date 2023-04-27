import * as http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';
import { compileSassAndSave } from 'compile-sass';

dotenv.config();

import { db } from './models/index.js';
import { UsersRepository } from './repositories/UsersRepository.js';
import * as UserController from './controllers/userController.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let serve = serveStatic(path.join(__dirname, 'public'), {
  index: ['/Views/index.html'],
});
const PORT = process.env.PORT || 8080;

await compileSassAndSave(
  path.join(__dirname, 'public/styles/scss/main.scss'),
  path.join(__dirname, 'public/styles/css')
);

const server = http.createServer((req, res) => {
  const url = req.url;

  serve(req, res, () => {});

  if (req.method === 'GET') {
    if (url.match(/\/users\?userId=([1-9][0-9]*)/)) {
      UserController.getUserDetails(req, res);
    }
  }

  if (req.method === 'POST') {
    if (url.match(/\/users\/add-user/)) {
      UserController.postAddUser(req, res);
    }
  }
});

db.sync({ force: true })
  .then(() => new UsersRepository().find(1))
  .then(user => {
    if (!user) {
      const newUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'johndoe',
        photo: '',
      };
      return new UsersRepository().create(newUser);
    }
    return Promise.resolve(user);
  })
  .then(result => {
    console.log(result);
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(err => {
    console.log(err.message);
  });
