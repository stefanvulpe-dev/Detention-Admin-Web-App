import dateExtension from '@hapi/joi-date';
import baseJoi from 'joi';
import moment from 'moment';
import {
  GuestsRepository,
  PrisonersRepository,
  VisitsRepository,
} from '../repositories/index.js';
import { sendEmail } from './emailController.js';
import * as Utils from './utils.js';
import { generateVisitHtml } from './utils.js';
const joi = baseJoi.extend(dateExtension);

/**
 *
 * @path '/visits/get-visit?visitId=?'
 * @method GET
 */
export const getVisitDetails = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const visitId = params.get('visitId');

    if (!visitId) {
      throw new Error('Missing visitId parameter.');
    }

    const visit = await new VisitsRepository().findById(visitId);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, visit }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
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

    const html = generateVisitHtml(
      newVisit.visitDate,
      newVisit.visitTime,
      `${firstName}  ${lastName}`,
      newVisit.visitNature
    );
    for (const guest of guests) {
      await sendEmail(
        guest.email,
        "Programare la 'Broken Dreams' efectuata",
        html
      );
    }

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

/**
 *
 * @method GET
 * @path '/visits/get-history?firstName=?&lastName=?'
 */
export const getVisitsHistory = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');

    if (!firstName || !lastName) {
      throw new Error('Invalid query params.');
    }

    const visitsIds = await new VisitsRepository().findVisit(
      firstName,
      lastName
    );

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, visitsIds }));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/visits/get-month-count?month=?'
 * @method GET
 */
export const getNumberOfVisitsPerMonth = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const month = params.get('month');

    if (!month) {
      throw new Error('Invalid query params.');
    }

    const numberOfVisits =
      await new VisitsRepository().getNumberOfVisitsPerMonth(month);

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, numberOfVisits }));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/visits/get-no3'
 * @method GET
 */
export const getNumberOfVisitsAveragePerMonth = async (req, res) => {
  try {
    const numberOfVisits =
      await new VisitsRepository().getNumberOfVisitsAveragePerMonth();

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, numberOfVisits }));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
