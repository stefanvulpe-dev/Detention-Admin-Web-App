import { pool } from '../models/db/pool.js';

export class PrisonersRepository {
  async create(prisoner) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into prisoners(id, "firstName", "lastName", "detentionStartedAt", "detentionEndedAt") values (default, $1, $2, $3, $4) returning *',
        [
          prisoner.firstName,
          prisoner.lastName,
          prisoner.detentionStartedAt,
          prisoner.detentionPeriod || prisoner.detentionEndedAt,
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

  async findByVisitId(visitId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select "firstName", "lastName"
          from prisoners p 
          join prisoners_visits pv on p.id = pv."prisonerId" and pv."visitId" = $1;`,
        [visitId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async getNumberOfPrisonersLastYear(year) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select count(*)
          from prisoners
          where extract(year from "detentionStartedAt") <= $1 
          and extract(year from "detentionEndedAt") >= $1;`,
        [year]
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async getNumberOfPrisonersPerSentence(min, max) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select count(*)
        from prisoners
        where extract(year from "detentionEndedAt") - extract(year from "detentionStartedAt") >= $1 
        and extract(year from "detentionEndedAt") - extract(year from "detentionStartedAt") < $2;`,
        [min, max]
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async getNumberOfPrisonersThisYear() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select count(*)
        from prisoners
        where extract(year from "detentionStartedAt") 
        = extract(year from now());`
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async getNumberOfPrisonersFreeThisYear() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select count(*)
        from prisoners
        where extract(year from "detentionEndedAt") = extract(year from now())
         and now() >= "detentionEndedAt";`
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}
