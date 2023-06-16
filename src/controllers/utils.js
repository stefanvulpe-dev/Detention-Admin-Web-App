import fs from 'fs';
import handlebars from 'handlebars';
import path, { dirname } from 'path';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const getReqData = req => {
  return new Promise((resolve, reject) => {
    try {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const parseCookies = req => {
  const list = {};
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) {
    return list;
  }

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) {
      return;
    }
    const value = rest.join(`=`).trim();
    if (!value) {
      return;
    }
    list[name] = decodeURIComponent(value);
  });

  return list;
};

export const generateReviewHtml = review => {
  const filePath = path.join(__dirname, '../views/email.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    firstName: review.firstName,
    lastName: review.lastName,
    suggestions: review.suggestions,
  };
  const modifiedHTML = template(replacements);
  return modifiedHTML;
};

export const generateVisitHtml = (date, time, prisoner, visitNature) => {
  const filePath = path.join(__dirname, '../views/visitEmail.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const replacements = {
    date: date,
    time: time,
    prisoner: prisoner,
    visitNature: visitNature,
  };
  const modifiedHTML = template(replacements);
  return modifiedHTML;
};

export const createReadableStreamFromString = str => {
  const stream = new Readable();
  stream._read = () => {};
  stream.push(str);
  stream.push(null);
  return stream;
};

export const getCSVData = str => {
  let body = str.replace(/;/g, ',');
  const startToken = 'firstName';
  const endToken = '----------------------------';

  const startIndex = body.indexOf(startToken);
  const endIndex = body.lastIndexOf(endToken);

  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    body = body.substring(startIndex, endIndex);
  }
  return body;
};
