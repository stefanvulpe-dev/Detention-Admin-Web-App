import * as guest from './guest.js';
import * as user from './user.js';
import * as prisoner from './prisoner.js';
import * as visit from './visit.js';
import * as session from './session.js';
import * as guestVisits from './guestVisits.js';
import * as prisonerVisits from './prisonerVisits.js';

export const dropTables = async () => {
  await user.dropUsersTable();
  await guest.dropGuestsTable();
  await prisoner.dropPrisonersTable();
  await visit.dropVisitsTable();
  await session.dropSessionsTable();
  await guestVisits.dropGuestsVisitsTable();
  await prisonerVisits.dropPrisonersVisitsTable();
};

export const createTables = async () => {
  await user.createUsersTable();
  await guest.createGuestsTable();
  await prisoner.createPrisonersTable();
  await visit.createVisitsTable();
  await session.createSessionsTable();
  await guestVisits.createGuestsVisitsTable();
  await prisonerVisits.createPrisonersVisitsTable();
};
