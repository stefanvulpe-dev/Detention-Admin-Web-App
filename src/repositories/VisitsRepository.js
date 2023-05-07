import { Visits } from '../models/index.js';

export class VisitsRepository {
  async create(visitDetails) {
    try {
      const newVisit = await Visits.create({ visitDetails });
      return newVisit;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async find(id) {
    try {
      const visit = await Visits.findOne({ where: { id: +id } });
      return visit;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
