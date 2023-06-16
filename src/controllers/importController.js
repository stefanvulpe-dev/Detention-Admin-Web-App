import csv from 'csv-parser';
import { PrisonersRepository } from '../repositories/index.js';
import {
  createReadableStreamFromString,
  getCSVData,
  getReqData,
} from './utils.js';
/**
 *
 * @path '/uploadCSV'
 * @method POST
 *
 */

export const importCSV = async (req, res) => {
  try {
    let body = getCSVData(await getReqData(req));

    const prisoners = [];
    const stream = createReadableStreamFromString(body);

    stream
      .pipe(csv())
      .on('data', row => {
        prisoners.push(row);
      })
      .on('end', () => {
        const prisonerRepository = new PrisonersRepository();
        for (const prisoner of prisoners) {
          prisonerRepository.create(prisoner);
        }
      })
      .on('error', err => {
        throw new Error(err);
      });

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
