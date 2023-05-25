import { pool } from '../models/db/pool.js';

export class GuestsRepository {
  async create(guest) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into guests(id, "firstName", "lastName", "email", "nationalId", "passportNumber", "photo") values (default, $1, $2, $3, $4, $5, $6) returning *',
        [
          guest.firstName,
          guest.lastName,
          guest.email,
          guest.nationalId,
          guest.passportNumber,
          guest.photo,
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
      const result = await client.query(
        'select * from guests where "id" = $1',
        [+id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async findByNationalId(nationalId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'select * from guests where "nationalId" = $1',
        [+nationalId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async updatePhoto(nationalId, photo) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `update guests 
         set photo = $2, 
         "updatedAt" = now() 
         where "nationalId" = $1 returning *`,
        [+nationalId, photo]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async deleteById(id) {
    const client = await pool.connect();
    try {
      await client.query(
        `delete from guests 
         where id = $1`,
        [+id]
      );
      return true;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }

  async processGuests(guests) {
    const client = await pool.connect();
    const guestsData = [];
    const guestRepository = new GuestsRepository();
    try {
      for (const obj of guests) {
        let guest = await guestRepository.findByNationalId(obj.nationalId);
        if (!guest) {
          guest = await guestRepository.create(obj);
        }
        const dataObj = { id: guest.id, relation: obj.relationship };
        guestsData.push(dataObj);
      }
      return guestsData;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}
