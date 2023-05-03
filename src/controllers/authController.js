import Joi from 'joi';
import { getReqData } from './utils.js';
import { Users } from '../models/user.js';
import jwt from 'jsonwebtoken';
import Tokens from 'csrf';
const { sign, verify } = jwt;

/**
 * @Path /register
 */
export const register = async (req, res) => {
  const body = await getReqData(req);
  const user = JSON.parse(body);

  const { error } = Joi.object({
    firstName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
    lastName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
    email: Joi.string().email(),
    password: Joi.string().pattern(
      new RegExp('^(?=.*?[A-Z])(?=.*?[a-z]).{5,30}$')
    ),
    photo: Joi.string().empty(''),
  }).validate(user);

  if (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: error.message }));
  }

  try {
    const result = await Users.create(user);
    const authToken = sign(result.dataValues, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '7d',
    });
    const csrfToken = new Tokens().create(process.env.CSRF_SECRET_KEY);
    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, authToken, csrfToken }));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

export const checkAuth = (req, res, next) => {
  const authToken = req.headers['authorization'].split(' ')[1];
  const csrfToken = req.headers['csrftoken'];

  if (!authToken || !csrfToken) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({ error: true, message: 'Missing authorization tokens.' })
    );
  }

  try {
    const payload = verify(authToken, process.env.ACCESS_SECRET_KEY);
    /* Check to see if the csrf token matches the one stored in the sessions table (search by token, not user id) */
    /* verifyCsrf(csrfToken, payload.id) */
    req.userId = payload.id;
    next();
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
