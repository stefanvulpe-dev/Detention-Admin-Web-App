import { PrisonersRepository } from '../repositories/index.js';
import * as Utils from './utils.js';

/**
 *
 * @path '/prisoners/get-prisoner?visitId=?'
 * @method GET
 */
export const getPrisonerDetails = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const visitId = params.get('visitId');

    if (!visitId) {
      throw new Error('Missing visitId parameter.');
    }

    const prisoner = await new PrisonersRepository().findByVisitId(visitId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, prisoner }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/search-prisoner'
 * @method POST
 */
export const getAllPrisonersNames = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const prisoner = JSON.parse(body);
    const prisoners =
      await new PrisonersRepository().findByFirstNameAndLastName(
        prisoner.firstName,
        prisoner.lastName
      );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, prisoners }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/get-count?year=?'
 * @method GET
 */
export const getNumberOfPrisonersPerYear = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const year = params.get('year');

    if (!year) {
      throw new Error('Missing year parameter.');
    }

    const numberOfPrisoners =
      await new PrisonersRepository().getNumberOfPrisonersLastYear(year);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, numberOfPrisoners }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/get-sentence-count?max=?'
 * @method GET
 */
export const getNumberOfPrisonersPerSentence = async (req, res) => {
  try {
    const params = new URLSearchParams(req.url.split('?')[1]);
    const min = params.get('min');
    const max = params.get('max');

    if (!min && !max) {
      throw new Error('Missing min and max parameter.');
    }
    const numberOfPrisoners =
      await new PrisonersRepository().getNumberOfPrisonersPerSentence(min, max);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, numberOfPrisoners }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
