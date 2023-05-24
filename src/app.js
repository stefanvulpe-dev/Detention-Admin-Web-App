import { compileSassAndSave } from 'compile-sass';
import 'dotenv/config';
import * as http from 'http';
import path, { dirname } from 'path';
import * as fs from 'fs';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
import { dropTables, createTables } from './models/sync.js';
import { UsersRepository, PrisonersRepository } from './repositories/index.js';
import {
  AuthController,
  UserController,
  GuestController,
  VisitController,
  PrisonerController,
} from './controllers/index.js';
import { pool } from './models/db/pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let serve = serveStatic(path.join(__dirname, 'public'));

const VIEWS_PATH = path.join(__dirname, '/views');
const PORT = process.env.PORT || 8080;

await compileSassAndSave(
  path.join(__dirname, 'public/styles/scss/main.scss'),
  path.join(__dirname, 'public/styles/css')
);

const server = http.createServer((req, res) => {
  const url = req.url;

  //for serving css and assets
  serve(req, res, () => {});

  if (req.method === 'GET') {
    if (url.match(/^\/$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/index.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/about.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/about.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/contact.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/contact.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/guestsDetails.html$/)) {
      AuthController.checkAuth(req, res, () => {
        const readStream = fs.createReadStream(
          `${VIEWS_PATH}/guestsDetails.html`
        );
        res.writeHead(200, {
          'Content-type': 'text/html',
        });
        readStream.pipe(res);
      });
    } else if (url.match(/^\/views\/visitDetails.html$/)) {
      AuthController.checkAuth(req, res, () => {
        const readStream = fs.createReadStream(
          `${VIEWS_PATH}/visitDetails.html`
        );
        res.writeHead(200, { 'Content-type': 'text/html' });
        readStream.pipe(res);
      });
    } else if (url.match(/^\/views\/statistics.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/statistics.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/login.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/login.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/signup.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/signup.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/404.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/404.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/help.html$/)) {
      const readStream = fs.createReadStream(`${VIEWS_PATH}/help.html`);
      res.writeHead(200, { 'Content-type': 'text/html' });
      readStream.pipe(res);
    } else if (url.match(/^\/views\/userProfile.html$/)) {
      AuthController.checkAuth(req, res, () => {
        const readStream = fs.createReadStream(
          `${VIEWS_PATH}/userProfile.html`
        );
        res.writeHead(200, { 'Content-type': 'text/html' });
        readStream.pipe(res);
      });
    } else if (url.match(/^\/users\/get-profile-picture$/)) {
      AuthController.requireAuth(req, res, () => {
        AuthController.getPhotoFromCloud(req, res);
      });
    } else if (url.match(/^\/users\/get-profile$/)) {
      AuthController.requireAuth(req, res, () => {
        UserController.getUserDetails(req, res);
      });
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
      AuthController.requireAuth(req, res, () =>
        VisitController.postAddVisit(req, res)
      );
    } else if (url.match(/\/register/)) {
      UserController.register(req, res);
    } else if (url.match(/\/prisoners\/search-prisoner/)) {
      PrisonerController.getAllPrisonersNames(req, res);
    }
  }

  if (req.method === 'DELETE') {
    if (req.url.match(/^\/logout$/)) {
      AuthController.requireAuth(req, res, () =>
        AuthController.logout(req, res)
      );
    }
  }
});

dropTables().then(result => {
  console.log('Finished dropping tables...');

  createTables().then(result => {
    console.log('Tables created.');
    console.log('Searching for John Doe...');

    new UsersRepository()
      .findById(1)
      .then(user => {
        if (!user) {
          return new UsersRepository().create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@gmail.com',
            password: 'johnDoe123',
            photo: 'johndoe.jpg',
          });
        }
        return Promise.resolve(user);
      })
      .then(user => {
        console.log(`John Doe is here`);
      });

    console.log('Adding Popescu Ion to jail...');

    new PrisonersRepository()
      .findById(1)
      .then(prisoner => {
        if (!prisoner) {
          return new PrisonersRepository().create({
            firstName: 'Popescu',
            lastName: 'Ion',
            detentionStartedAt: '2009-09-15',
            detentionPeriod: '2023-10-14',
          });
        }
        return Promise.resolve(prisoner);
      })
      .then(() => {
        console.log(`Popescu Ion is in jail`);
        console.log('Adding Popescu Marian to jail...');
        return new PrisonersRepository().create({
          firstName: 'Popescu',
          lastName: 'Marian',
          detentionStartedAt: '2009-09-15',
          detentionPeriod: '2023-10-14',
        });
      })
      .then(() => {
        console.log(`Popescu Marian is in jail`);
      });
  });
});

server.listen(PORT, () => console.log(`Listenting on port ${PORT}`));

process.on('SIGINT', async function () {
  await pool.end();
  server.close();
  process.exit();
});
