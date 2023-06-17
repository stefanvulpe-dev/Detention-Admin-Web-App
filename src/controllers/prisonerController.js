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

/**
 *
 * @path '/prisoners/get-no1'
 * @method GET
 */
export const getNumberOfPrisonersThisYear = async (req, res) => {
  try {
    const numberOfPrisoners =
      await new PrisonersRepository().getNumberOfPrisonersThisYear();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, numberOfPrisoners }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/get-no2'
 * @method GET
 */
export const getNumberOfPrisonersFreeThisYear = async (req, res) => {
  try {
    const numberOfPrisoners =
      await new PrisonersRepository().getNumberOfPrisonersFreeThisYear();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: false, numberOfPrisoners }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/get-info-json'
 * @method GET
 */
export const getPrisonersInfoJSON = async (req, res) => {
  try {
    const info = await new PrisonersRepository().getPrisonersInfo();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/get-info-csv'
 * @method GET
 */
export const getPrisonersInfoCSV = async (req, res) => {
  try {
    const info = await new PrisonersRepository().getPrisonersInfo();

    const csv = `Counter,Prisoner,Detention Period,Total Number of Visits,Average Guests per Visit\n${info
      .map(
        row =>
          `${row.counter},"${row.prisoner}",${row.detentionPeriod},${row.totalNumberOfVisits},${row.averageGuestsPerVisit}`
      )
      .join('\n')
      .trim()}\n`;

    res.setHeader('Content-Disposition', `attachment; filename="data.csv"`);
    res.setHeader('Content-Type', 'text/csv');
    res.end(csv);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path '/prisoners/get-info-html'
 * @method GET
 */
export const getPrisonersInfoHTML = async (req, res) => {
  try {
    const info = await new PrisonersRepository().getPrisonersInfo();
    const html = `
    <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Document HTML</title>
      </head>
      <style>
        table, th, td {
        border:1px solid black;
      }
      </style>    
      <body>
        <h1>Informații despre deținuți</h1>
        <table>
          <tr>
            <th>Counter</th>
            <th>Prisoner</th>
            <th>Detention Period</th>
            <th>Total Number of Visits</th>
            <th>Average Guests per Visit</th>
          </tr>
          ${info
            .map(
              row => `
            <tr>
              <td>${row.counter}</td>
              <td>${row.prisoner}</td>
              <td>${row.detentionPeriod}</td>
              <td>${row.totalNumberOfVisits}</td>
              <td>${row.averageGuestsPerVisit}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      </body>
      </html>
    `;
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="document.html"'
    );
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
