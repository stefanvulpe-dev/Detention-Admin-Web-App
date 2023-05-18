import { pool } from '../models/db/pool.js';

export class VisitsRepository {
  async create(visitDetails) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into visits (id, "date", "time", "nature", "objects", "mood", "summary") values (default, $1, $2, $3, $4, $5, $6) returning *',
        [
          visitDetails['visitDate'],
          visitDetails['visitTime'],
          visitDetails['visitNature'],
          visitDetails['objectData'],
          visitDetails['prisonerMood'],
          visitDetails['summary'],
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
}
