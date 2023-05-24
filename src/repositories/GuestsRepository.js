import { pool } from '../models/db/pool.js';

export class GuestsRepository {
  async create(guest) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'insert into guests(id, "firstName", "lastName", "email", "nationalId", "photo") values (default, $1, $2, $3, $4, $5) returning *',
        [
          guest.firstName,
          guest.lastName,
          guest.email,
          guest.nationalId,
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
    // id = nationalId
    const client = await pool.connect();
    try {
      const result = await client.query(
        'select * from guests where "nationalId" = $1',
        [+id]
      );
      return result.rows[0];
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
        let guest = await guestRepository.findById(obj.nationalId);
        if (!guest) guest = await guestRepository.create(obj);
        const dataObj = { id: guest.id, relation: obj.relation };
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
