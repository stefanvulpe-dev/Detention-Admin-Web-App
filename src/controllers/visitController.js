import {
  VisitsRepository,
  PrisonersRepository,
  GuestsRepository,
} from '../repositories/index.js';
import * as Utils from './utils.js';
import baseJoi from 'joi';
import dateExtension from '@hapi/joi-date';
const joi = baseJoi.extend(dateExtension);
/**
 * @Path '/visits?visitId=?'
 */
export const getVisitDetails = async (req, res) => {
  let visitId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'visitId') {
      visitId = value;
    }
  }
  try {
    const visit = await new VisitsRepository().find(visitId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(visit));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};

/**
 * @Path '/visits/add-visit'
 */
export const postAddVisit = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const { guests, prisoner, ...newVisit } = JSON.parse(body);
    const { error } = joi
      .object({
        visitDate: joi.date().format('YYYY-MM-DD').min('now').required(),
        visitTime: joi
          .string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required(),
        visitNature: joi
          .string()
          .pattern(/[A-Za-z]+/)
          .min(3)
          .required(),
        objectData: joi
          .string()
          .pattern(/[A-Za-z,]+/)
          .min(3)
          .required(),
        prisonerMood: joi
          .string()
          .pattern(/[A-Za-z.]+/)
          .min(3)
          .required(),
        summary: joi
          .string()
          .pattern(/[A-Za-z,.]+/)
          .required(),
      })
      .validate(newVisit);

    if (error) {
      throw new Error(error.message);
    }

    const visitsRepository = new VisitsRepository();
    const visitId = (await visitsRepository.create(newVisit)).id;

    // DUMMY
    await new PrisonersRepository().create({
      firstName: 'Gheorghe',
      lastName: 'Becali',
      detentionStartedAt: '2002-12-12',
      detentionPeriod: '2025-05-05',
    });
    // --------

    const firstName = prisoner.firstName,
      lastName = prisoner.lastName;

    const prisonerId = (
      await new PrisonersRepository().findByName(firstName, lastName)
    ).id;

    const guestRepository = new GuestsRepository();
    const guestsData = await guestRepository.processGuests(guests);

    visitsRepository.recordGuestVisits(guestsData, visitId);
    visitsRepository.recordPrisonerVisits(prisonerId, visitId);

    res.writeHead(201, {
      'Content-type': 'application/json',
    });
    res.end(JSON.stringify('Visit successfully created!'));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};
