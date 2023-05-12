import { pool } from './db/pool.js';

export const dropPrisonersVisitsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`drop table if exists prisoners_visits cascade`);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createPrisonersVisitsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `create table prisoners_visits
     (
        id           serial primary key,
        "prisonerId" integer                  not null,
        "visitId"    integer                  not null,
        "createdAt" timestamp with time zone not null default now(),
        "updatedAt" timestamp with time zone not null default now(),
        constraint fk_prisoner foreign key("prisonerId") references prisoners(id), 
        constraint fk_visit foreign key("visitId") references visits(id)
     );`
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
