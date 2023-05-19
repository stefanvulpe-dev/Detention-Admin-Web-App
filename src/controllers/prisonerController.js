import { PrisonersRepository } from '../repositories/index.js';
import * as Utils from './utils.js';
/**
 * @Path '/prisoners?prisonerId=?'
 */
export const getPrisonerDetails = async (req, res) => {
  let prisonerId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'prisonerId') {
      prisonerId = value;
    }
  }
  try {
    const prisoner = await new PrisonersRepository().find(prisonerId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(prisoner));
    } catch(err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      }
};

export const getAllPrisonersNames = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const prisoner = JSON.parse(body);
    const prisonerNames =
      await new PrisonersRepository().findByFirstNameAndLastName(prisoner.firstName,prisoner.lastName);
      console.log(prisonerNames);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(prisonerNames));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};