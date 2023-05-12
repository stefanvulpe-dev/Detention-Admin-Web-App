import { pool } from './db/pool.js';

export const dropSessionsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(`drop table if exists sessions cascade`);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};

export const createSessionsTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      `create table sessions
      (
        id          serial primary key,
        "csrfToken" varchar(255)             not null,
        "userId"    integer, 
        "createdAt" timestamp with time zone not null default now(),
        "updatedAt" timestamp with time zone not null default now(),
        constraint fk_user foreign key("userId") references users(id)
      );`
    );
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
};
