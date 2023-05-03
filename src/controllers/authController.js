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
    const secret = await new Tokens().secret();
    const csrfToken = new Tokens().create(secret);
    res.writeHead(201, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, authToken, csrfToken }));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @Path /login
 */
export const login = async (req,res) => {
  const body = await getReqData(req);
  const credentials = JSON.parse(body);
  const { error } = Joi
    .object({
      email: Joi.string().min(13).max(50).required(),
      password: Joi
        .string()
        .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
        .required(),
    })
    .validate(credentials);

  if (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: error.message }));
  }

  try {
    const user = await Users.login(credentials.email,credentials.password);
    const payload = { email: user.email, password: user.password };
    const authToken = sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '7d',
    });
    const secret = await new Tokens().secret();
    const csrfToken = new Tokens().create(secret);
    
    if (!user) {
      throw new Error(`User ${credentials.email} has not been found`);
    }
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, authToken, csrfToken }));
  } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

