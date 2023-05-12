import { pool } from './db/pool.js';

export const dropVisitsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`drop table if exists visits cascade`);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createVisitsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `create table visits
      (
        id          serial primary key,
        date        date                     not null,
        time        time                     not null,
        nature      varchar(255)             not null,
        objects     varchar(255)             not null,
        mood        varchar(255)             not null,
        summary     varchar(255)             not null,
        "createdAt" timestamp with time zone not null default now(),
        "updatedAt" timestamp with time zone not null default now()
      );`
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
