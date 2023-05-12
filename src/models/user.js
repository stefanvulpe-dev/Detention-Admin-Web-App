import { pool } from './db/pool.js';

export const dropUsersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`drop table if exists users cascade`);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createUsersTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `create table users
      (
        id          serial primary key,
        "firstName" varchar(255)             not null,
        "lastName"  varchar(255)             not null,
        email       varchar(255)             not null unique,
        password    varchar(255)             not null,
        photo       varchar(255)             not null,
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
