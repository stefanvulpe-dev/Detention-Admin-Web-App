import { pool } from '../models/db/pool.js';
export class SessionsRepository {
  async create(userId, csrfToken) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `insert into sessions (id, "csrfToken", "userId") values (default, $1, $2) returning *`,
        [csrfToken, +userId]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }

  async verifySession(userId, csrfToken) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `select "userId" from sessions where "csrfToken" = $1`,
        [csrfToken]
      );
      if (!result.rows[0]) {
        throw new Error(
          `User ${userId}, csrfToken ${csrfToken} is not logged in.`
        );
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }

  async deleteSession(userId, csrfToken) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `delete from sessions where "userId" = $1 and "csrfToken" = $2`,
        [userId, csrfToken]
      );
      if (result.rowCount === 0) {
        throw new Error(
          `A session for the user ${userId} and csrfToken ${csrfToken} has not been found`
        );
      }
      return result.rowCount;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }
}
