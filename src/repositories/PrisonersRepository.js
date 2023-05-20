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
    try {
    } catch (error) {
      throw new Error(error.message);
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
      console.log(error.message);
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}
