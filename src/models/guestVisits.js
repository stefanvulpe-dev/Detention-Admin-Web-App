import { pool } from './db/pool.js';

export const dropGuestsVisitsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`drop table if exists guests_visits cascade`);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createGuestsVisitsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `create table guests_visits
      (
        id                 serial primary key,
        "visitId"          integer                  not null,
        "guestId"          integer                  not null,
        "prisonerRelation" varchar(255)             not null,
        "createdAt" timestamp with time zone not null default now(),
        "updatedAt" timestamp with time zone not null default now(),
        constraint fk_guest foreign key("guestId") references guests(id), 
        constraint fk_visit foreign key("visitId") references visits(id)
      );`
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
