import { pool } from '../models/db/pool.js';
import * as bcrypt from 'bcrypt';

export class UsersRepository {
  async create(user) {
    const client = await pool.connect();
    try {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
      const { firstName, lastName, email, password, photo } = user;

      const query = {
        name: 'insert-user',
        text: `insert into users(id, "firstName", "lastName", email, password, photo) values (default, $1, $2, $3, $4, $5) returning *`,
        values: [firstName, lastName, email, password, photo],
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
        rowMode: 'array',
      };
      const result = await client.query(query);
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
