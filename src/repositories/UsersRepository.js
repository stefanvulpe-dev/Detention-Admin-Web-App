import * as bcrypt from 'bcrypt';
import { pool } from '../models/db/pool.js';

export class UsersRepository {
  async create(user) {
    const client = await pool.connect();
    try {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);

      const query = {
        name: 'insert-user',
        text: `insert into users(id, "firstName", "lastName", email, password, photo) values (default, $1, $2, $3, $4, $5) returning *`,
        values: [...Object.values(user)],
      };

      const result = await client.query(query);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const client = await pool.connect();
    try {
      const query = {
        name: 'find-user',
        text: 'select * from users where id = $1',
        values: [+id],
      };
      const result = await client.query(query);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }

  async findByEmail(email) {
    const client = await pool.connect();
    try {
      const query = {
        name: 'find-user-by-email',
        text: 'select * from users where email = $1',
        values: [email],
      };
      const result = await client.query(query);
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }

  async updateById(id, user) {
    const client = await pool.connect();
    try {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);

      const result = await client.query(
        `update users 
        set "lastName" = $2, "firstName" = $3, email = $4, password = $5, photo = $6
        where id = $1 returning *`,
        [id, ...Object.values(user)]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }

  async login(email, password) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'select * from users where email = $1',
        [email]
      );

      if (result.rowCount !== 0) {
        const user = result.rows[0];
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
          return user;
        }
        throw new Error('Incorrect password');
      }
      throw new Error('Incorrect email');
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.release();
    }
  }
}
