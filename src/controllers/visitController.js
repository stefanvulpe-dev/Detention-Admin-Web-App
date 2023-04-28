import { VisitsRepository } from '../repositories/index.js';
import * as Utils from './utils.js';

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
    } catch(err) {
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
    const result = await new VisitsRepository().create(newVisit);
    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};