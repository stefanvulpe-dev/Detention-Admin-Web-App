import { compileSassAndSave } from 'compile-sass';
import 'dotenv/config';
import * as http from 'http';
import path, { dirname } from 'path';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

import { db } from './models/index.js';
import { UsersRepository } from './repositories/UsersRepository.js';
import {
  AuthController,
  UserController,
  GuestController,
  PrisonerController,
  VisitController,
} from './controllers/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let serve = serveStatic(path.join(__dirname, 'public'), {
  index: ['/views/index.html'],
});
const PRIVATE_VIEWS_PATH = path.join(__dirname, '/views');
const PORT = process.env.PORT || 8080;

await compileSassAndSave(
  path.join(__dirname, 'public/styles/scss/main.scss'),
  path.join(__dirname, 'public/styles/css')
);

const server = http.createServer((req, res) => {
  const url = req.url;

  serve(req, res, () => {});

  if (req.method === 'GET') {
    if (url.match(/\/users\/\?userId=([1-9][0-9]*)/)) {
      AuthController.checkAuth(req, res, () =>
        UserController.getUserDetails(req, res)
      );
    } else if (url.match(/\/prisoners\?prisonerId=([1-9][0-9]*)/)) {
      PrisonerController.getPrisonerDetails(req, res);
    } else if (url.match(/\/guests\?guestId=([1-9][0-9]*)/)) {
      GuestController.getGuestDetails(req, res);
    } else if (url.match(/\/visits\?visitId=([1-9][0-9]*)/)) {
      VisitController.getVisitDetails(req, res);
    }
  }

  if (req.method === 'POST') {
    if (url.match(/^\/register$/)) {
      AuthController.register(req, res);
    } else if (url.match(/^\/login$/)) {
      AuthController.login(req, res);
    } else if (url.match(/\/guests\/add-guest/)) {
      GuestController.postAddGuest(req, res);
    } else if (url.match(/\/visits\/add-visit/)) {
      VisitController.postAddVisit(req, res);
    } else if (url.match(/\/register/)) {
      UserController.register(req, res);
    }
  }

  if (req.method === 'DELETE') {
    if (req.url.match(/^\/logout$/)) {
      AuthController.checkAuth(req, res, () => AuthController.logout(req, res));
    }
  }
});

db.sync({ force: true })
  .then(() => new UsersRepository().find(1))
  .then(user => {
    if (!user) {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        password: 'johnDoe123',
        photo: '',
      };
      return new UsersRepository().create(newUser);
    }
    return Promise.resolve(user);
  })
  .then(result => {
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(err => {
    console.log(err.message);
  });

process.on('SIGINT', function () {
  db.close();
  server.close();
  process.exit();
});
