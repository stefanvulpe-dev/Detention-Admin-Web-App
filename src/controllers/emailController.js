import fs from 'fs';
import handlebars from 'handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const generateHtml = review => {
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
