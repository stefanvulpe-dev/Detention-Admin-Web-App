import { compileSassAndSave } from 'compile-sass';
import dotenv from 'dotenv';
import * as http from 'http';
import path, { dirname } from 'path';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
import { Umzug, SequelizeStorage } from 'umzug';

dotenv.config();

import * as UserController from './controllers/userController.js';
import { db } from './models/index.js';
import { UsersRepository } from './repositories/UsersRepository.js';
import * as PrisonerController from './controllers/prisonerController.js';
import * as GuestController from './controllers/guestController.js';
import * as VisitController from './controllers/visitController.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
let serve = serveStatic(path.join(__dirname, 'public'), {
  index: ['/Views/index.html'],
});
const PORT = process.env.PORT || 8080;

const umzug = new Umzug({
  migrations: { glob: path.join(__dirname, '/repositories/migrations/*.js') },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: console,
});

const migrations = await umzug.pending();
console.log(migrations);

//await umzug.up();

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
    } else if (url.match(/\/prisoners\?prisonerId=([1-9][0-9]*)/)) {
      PrisonerController.getPrisonerDetails(req, res);
    } else if (url.match(/\/guests\?guestId=([1-9][0-9]*)/)) {
      GuestController.getGuestDetails(req, res);
    } else if (url.match(/\/visits\?visitId=([1-9][0-9]*)/)) {
      VisitController.getVisitDetails(req, res);
    }
  }

  if (req.method === 'POST') {
    if (url.match(/\/users\/add-user/)) {
      UserController.postAddUser(req, res);
    } else if (url.match(/\/guests\/add-guest/)) {
      GuestController.postAddGuest(req, res);
    } else if (url.match(/\/visits\/add-visit/)) {
      VisitController.postAddVisit(req, res);
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
        password: 'johndoe',
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
