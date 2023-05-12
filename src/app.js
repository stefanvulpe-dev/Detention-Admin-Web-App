import { compileSassAndSave } from 'compile-sass';
import 'dotenv/config';
import * as http from 'http';
import path, { dirname } from 'path';
import * as fs from 'fs';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';

import {
  AuthController,
  UserController,
  GuestController,
  VisitController,
} from './controllers/index.js';

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
      AuthController.requireAuth(req, res, () =>
        AuthController.logout(req, res)
      );
    }
  }
});

// dropTables().then(result => {
//   console.log('Finished dropping tables...');

//   createTables().then(result => {
//     console.log('Tables created.');
//     console.log('Searching for John Doe...');

//     new UsersRepository()
//       .findById(1)
//       .then(user => {
//         if (!user) {
//           return new UsersRepository().create({
//             firstName: 'John',
//             lastName: 'Doe',
//             email: 'johndoe@gmail.com',
//             password: 'johnDoe123',
//             photo: '',
//           });
//         }
//         return Promise.resolve(user);
//       })
//       .then(user => {
//         console.log(`John Doe is here`);
//         server.listen(PORT, () => console.log(`Listenting on port ${PORT}`));
//       });
//   });
// });

server.listen(PORT, () => console.log(`Listenting on port ${PORT}`));

process.on('SIGINT', function () {
  db.close();
  server.close();
  process.exit();
});
