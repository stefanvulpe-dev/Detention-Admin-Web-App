import joi from 'joi';
import { sendEmail } from './emailController.js';
import * as Utils from './utils.js';
import { generateReviewHtml } from './utils.js';
/**
 * @path /contact/send
 * @method POST
 */

export const sendReview = async (req, res) => {
  try {
    const body = await Utils.getReqData(req);
    const review = JSON.parse(body);
    const { error } = joi
      .object({
        firstName: joi
          .string()
          .pattern(/^[A-Z][A-Za-z]+$/)
          .required(),
        lastName: joi
          .string()
          .pattern(/^[A-Z][A-Za-z]+$/)
          .required(),
        email: joi.string().email().required(),
        suggestions: joi
          .string()
          .pattern(/^[a-zA-Z0-9.,!?'" \-]+$/)
          .required(),
      })
      .validate(review);

    if (error) {
      throw new Error(error.message);
    }

    const html = generateReviewHtml(review);

    await sendEmail(review.email, "Feedback 'Broken Dreams' procesat", html);

    res.writeHead(201, {
      'Content-type': 'application/json',
    });
    res.end(JSON.stringify({ error: false }));
  } catch (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: error.message }));
  }
};
