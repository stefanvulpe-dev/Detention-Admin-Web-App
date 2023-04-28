import { Details, Visits } from '../models/index.js';

export class VisitsRepository {
  async create(visitDetails) {
    try {
      // visitsDetails = VisitDetails + idGuests + idPrisoner (idGuests trebuie sa existe!)
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

  validateDetails(visitDetails) {
    // here we will validate visitDetails, time and date
    const current_date = new Date(),
      visitDate = new Date(visitDetails.date);
  }
}
