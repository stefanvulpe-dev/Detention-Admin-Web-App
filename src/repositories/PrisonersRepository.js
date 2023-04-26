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

  async getVisitsHistory(id) {
    // returns Visits[]
    try {
      const visits = await Visits.findAll({ where: { idPrisoner: +id } });
      return visits;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getRemainigPerioad(id) {
    const prisoner = PrisonersRepository.find(id);
    const currentDate = new Date(),
      started_at = new Date(prisoner.started_at);
    return (
      prisoner.detention_period * 365 * 24 * 60 * 60 * 1000 -
      (currentDate - started_at)
    );
    // calculates in milliseconds the remaining time of prisoner
  }
}