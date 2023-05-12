import { pool } from './db/pool.js';

export const dropPrisonersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`drop table if exists prisoners cascade`);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createPrisonersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `create table prisoners
      (
        id                   serial primary key,
        "firstName"          varchar(255)             not null,
        "lastName"           varchar(255)             not null,
        "detentionStartedAt" date                     not null,
        "detentionPeriod"    date                     not null,
        "createdAt" timestamp with time zone not null default now(),
        "updatedAt" timestamp with time zone not null default now()
      )`
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
