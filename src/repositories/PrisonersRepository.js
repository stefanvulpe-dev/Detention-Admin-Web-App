import { pool } from '../models/db/pool.js';

export class PrisonersRepository {
  async create(prisoner) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into prisoners(id, "firstName", "lastName", "detentionStartedAt", "detentionPeriod") values (default, $1, $2, $3, $4) returning *',
        [
          prisoner.firstName,
          prisoner.lastName,
          prisoner.detentionStartedAt,
          prisoner.detentionPeriod,
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const client = await pool.connect();
    try {
      const query = {
        name: 'find-prisoner',
        text: 'select * from prisoners where id = $1',
        values: [+id],
      };
      const result = await client.query(query);
      return result.rows[0];
    } catch (err) {
      throw Error(err.message);
    } finally {
      client.release();
    }
  }

  async findByFirstNameAndLastName(firstName, lastName) {
    const client = await pool.connect();
    try {
      let query;
      if (lastName === '') {
        query = {
          name: 'find-prisoner-one-name',
          text: 'select "firstName", "lastName" from prisoners where "firstName" = $1 or "lastName" = $1',
          values: [firstName],
        };
      } else {
        query = {
          name: 'find-prisoner-full-name',
          text: 'select "firstName", "lastName" from prisoners where "firstName" = $1 and "lastName" = $2',
          values: [firstName, lastName],
        };
      }
      const result = await client.query(query);
      return result.rows;
    } catch (err) {
      throw Error(err.message);
    } finally {
      client.release();
    }
  }

  async getVisitsHistory(id) {}

  async findByName(firstName, lastName) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'select * from prisoners where "firstName" = $1 and "lastName" = $2',
        [firstName, lastName]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}
