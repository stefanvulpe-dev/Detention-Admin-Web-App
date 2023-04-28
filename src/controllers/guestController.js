import { GuestsRepository } from '../repositories/index.js';
import * as Utils from './utils.js';

/**
 * @Path '/guests?guestId=?'
 */
export const getGuestDetails = async (req, res) => {
  let guestId;
  const params = new URLSearchParams(req.url.split('/').join('').split('?')[1]);
  for (const [key, value] of params) {
    if (key === 'guestId') {
        guestId = value;
    }
  }
  try {
    const guest = await new GuestsRepository().find(guestId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(guest));
    } catch(err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
      }
};

/**
 * @Path '/guests/add-guest'
 */
export const postAddGuest = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const newGuest = JSON.parse(body);
    const result = await new GuestsRepository().create(newGuest);
    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ message: err.message }));
  }
};