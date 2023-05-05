import Joi from 'joi';
import { getReqData } from './utils.js';
import jwt from 'jsonwebtoken';
import Tokens from 'csrf';
import { SessionsRepository, UsersRepository } from '../repositories/index.js';
const { sign, verify } = jwt;

/**
 * @Path /register
 */
export const register = async (req, res) => {
  const body = await getReqData(req);
  const credentials = JSON.parse(body);

  const { error } = Joi.object({
    firstName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
    lastName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
    email: Joi.string().email(),
    password: Joi.string().pattern(
      new RegExp('^(?=.*?[A-Z])(?=.*?[a-z]).{5,30}$')
    ),
    photo: Joi.string().empty(''),
  }).validate(credentials);

  if (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: error.message }));
  }

  try {
    const user = await new UsersRepository().create(credentials);
    const { password, ...payload } = {
      password: user.dataValues.password,
      ...user.dataValues,
    };
    const authToken = sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '7d',
    });
    const csrfToken = new Tokens().create(process.env.CSRF_SECRET_KEY);
    await user.createSession({ csrfToken });

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
export const login = async (req, res) => {
  const body = await getReqData(req);
  const credentials = JSON.parse(body);
  const { error } = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
      .required(),
  }).validate(credentials);

  if (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: error.message }));
  }

  try {
    const user = await new UsersRepository().login(
      credentials.email,
      credentials.password
    );
    const { password, ...payload } = {
      password: user.dataValues.password,
      ...user.dataValues,
    };
    const authToken = sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '7d',
    });
    const csrfToken = new Tokens().create(process.env.CSRF_SECRET_KEY);
    user.createSession({ csrfToken });

    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: false, authToken, csrfToken }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

export const checkAuth = async (req, res, next) => {
  const authToken = req.headers['authorization']?.split(' ')[1];
  const csrfToken = req.headers['csrftoken'];

  if (!authToken || !csrfToken) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({ error: true, message: 'Missing authorization tokens.' })
    );
  }

  try {
    const payload = verify(authToken, process.env.ACCESS_SECRET_KEY);
    await new SessionsRepository().verifySession(payload.id, csrfToken);
    req.userId = payload.id;
    next();
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};
