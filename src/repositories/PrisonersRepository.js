import { pool } from '../models/db/pool.js';

export class PrisonersRepository {
  async create(prisoner) {
    const client = await pool.connect();
    try {
      const { firstName, lastName, detentionStartedAt, detentionPeriod } =
        prisoner;
      const query = {
        name: 'insert-prisoner',
        text: `insert into prisoners(id, "firstName", "lastName", "detentionStartedAt", "detentionPeriod") values (default, $1, $2, $3, $4) returning *`,
        values: [firstName, lastName, detentionStartedAt, detentionPeriod],
      };

      const result = await client.query(query);
      return result.rows[0];
    } catch (err) {
      throw Error(err.message);
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
        rowMode: 'array',
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
          rowMode: 'array',
        };
      } else {
        query = {
          name: 'find-prisoner-full-name',
          text: 'select "firstName", "lastName" from prisoners where "firstName" = $1 and "lastName" = $2',
          values: [firstName, lastName],
          rowMode: 'array',
        };
      }
      const result = await client.query(query);
      const prisonerNames = [];

      result.rows.map(row => {
        prisonerNames.push({
          firstName: row[0],
          lastName: row[1],
        });
      });
      return prisonerNames;
    } catch (err) {
      throw Error(err.message);
    } finally {
      client.release();
    }
  }

  async getVisitsHistory(id) {}
}
