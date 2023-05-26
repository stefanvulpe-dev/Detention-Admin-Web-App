import dateExtension from '@hapi/joi-date';
import baseJoi from 'joi';
import moment from 'moment';
import {
  GuestsRepository,
  PrisonersRepository,
  VisitsRepository,
} from '../repositories/index.js';
import * as Utils from './utils.js';
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
 *
 * @path '/visits/add-visit'
 * @method POST
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
          .pattern(/^([01]\d|2[0-3])h:([0-5]\d)m$/)
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

    const time = moment(newVisit.visitTime, 'HH:mm').format('HH:mm:ss');
    newVisit.visitTime = time;

    const visitsRepository = new VisitsRepository();
    const visitId = (await visitsRepository.create(newVisit)).id;

    const { firstName, lastName } = prisoner;

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
    res.end(
      JSON.stringify({ error: false, message: 'Visit sucessfully created.' })
    );
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
