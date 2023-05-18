import { VisitsRepository } from '../repositories/index.js';
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
    const newVisit = JSON.parse(body);
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

    await new VisitsRepository().create(newVisit);

    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify('Visit successfully created!'));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};
