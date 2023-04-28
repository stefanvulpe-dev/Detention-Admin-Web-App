import { Prisoners } from '../models/index.js';
import { Visits } from '../models/index.js';

export class PrisonersRepository {
  async create(prisoner) {
    try {
      const newPrisoner = await Prisoners.create(prisoner);
      return newPrisoner;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async find(id) {
    try {
      const prisoner = await Prisoners.findOne({ where: { id: +id } });
      return prisoner;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getVisitsHistory(id) {}

  async getRemainingPeriod(id) {
    const prisoner = await find(id);
    const currentDate = new Date(),
      started_at = new Date(prisoner.started_at);
    return (
      prisoner.detention_period * 365 * 24 * 60 * 60 * 1000 -
      (currentDate - started_at)
    );
    // calculates in milliseconds the remaining time of prisoner
  }
}
