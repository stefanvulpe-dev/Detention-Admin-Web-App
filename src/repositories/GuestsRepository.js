import { Guests } from '../models/index.js';

export class GuestsRepository {
  async create(guest) {
    try {
      const newGuest = await Guests.create(guest);
      return newGuest;
    } catch (error) {
      throw Error(error.message);
    }
  }

  async find(id) {
    try {
      const guest = await Guests.findOne({ where: { id: +id } });
      return guest;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
