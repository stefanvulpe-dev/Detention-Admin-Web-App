import csv from 'csv-parser';
import multer from 'multer';
import { Readable } from 'stream';
import { PrisonersRepository } from '../repositories/index.js';
/**
 *
 * @path '/uploadCSV'
 * @method POST
 *
 */

export const importCSV = async (req, res) => {
  try {
    const upload = multer();
    upload.single('file')(req, res, async err => {
      if (err instanceof multer.MulterError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: true, message: err.message }));
      } else if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: true,
            message: 'Error uploading file.' + err,
          })
        );
      } else {
        const uploadedFile = req.file;
        if (uploadedFile.mimetype !== 'text/csv')
          throw new Error('Not a CSV file.');

        const stream = Readable.from(uploadedFile.buffer);
        const prisoners = [];

        stream
          .pipe(csv())
          .on('data', row => {
            prisoners.push(row);
          })
          .on('end', () => {
            const prisonerRepository = new PrisonersRepository();
            for (const prisoner of prisoners) {
              if (
                prisoner.firstName !== undefined &&
                prisoner.lastName !== undefined &&
                prisoner.detentionStartedAt !== undefined &&
                prisoner.detentionEndedAt !== undefined
              )
                prisonerRepository.create(prisoner);
            }
          })
          .on('error', err => {
            throw new Error(err);
          });
      }
    });

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @Path /uploadJSON
 * @method POST
 */

export const importJSON = async (req, res) => {
  try {
    const upload = multer();
    upload.single('file')(req, res, async err => {
      if (err instanceof multer.MulterError) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: true, message: err.message }));
      } else if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: true,
            message: 'Error uploading file.' + err,
          })
        );
      } else {
        const uploadedFile = req.file;

        if (uploadedFile.mimetype !== 'application/json')
          throw new Error('Not a JSON file.');

        const prisoners = JSON.parse(uploadedFile.buffer.toString('utf8'));
        const prisonerRepository = new PrisonersRepository();
        for (const prisoner of prisoners) {
          if (
            prisoner.firstName !== undefined &&
            prisoner.lastName !== undefined &&
            prisoner.detentionStartedAt !== undefined &&
            prisoner.detentionEndedAt !== undefined
          )
            prisonerRepository.create(prisoner);
        }
      }
    });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
