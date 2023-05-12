import Joi from 'joi';
import { getReqData, parseCookies } from './utils.js';
import jwt from 'jsonwebtoken';
import Tokens from 'csrf';
import { SessionsRepository, UsersRepository } from '../repositories/index.js';
const { sign, verify } = jwt;

/**
 *
 * @path /register
 * @method POST
 */
export const register = async (req, res) => {
  const body = await getReqData(req);
  const credentials = JSON.parse(body);

  const { error } = Joi.object({
    firstName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
    lastName: Joi.string().pattern(new RegExp('^[A-Z][a-z]+$')),
    email: Joi.string().email(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{5,30}$'))
      .required(),
    photo: Joi.string().empty(''),
  }).validate(credentials);

  if (error) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: error.message }));
  }

  try {
    const user = await new UsersRepository().create(credentials);
    const { password, ...payload } = {
      password: user.password,
      ...user,
    };
    const authToken = sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '7d',
    });
    const csrfToken = new Tokens().create(process.env.CSRF_SECRET_KEY);
    await new SessionsRepository().create(user.id, csrfToken);

    res.writeHead(201, {
      'Content-type': 'application/json',
      'Set-Cookie': `authToken=${authToken}; SameSite=Strict; HttpOnly=true; Expires=${
        Date.now() + 7 * 24 * 60 * 60 * 1000
      }`,
    });
    res.end(JSON.stringify({ error: false, csrfToken }));
  } catch (err) {
    res.writeHead(400, { 'Content-type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path /login
 * @method POST
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
      password: user.password,
      ...user,
    };
    const authToken = sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: '7d',
    });
    const csrfToken = new Tokens().create(process.env.CSRF_SECRET_KEY);
    await new SessionsRepository().create(user.id, csrfToken);

    res.writeHead(201, {
      'Content-type': 'application/json',
      'Set-Cookie': `authToken=${authToken}; SameSite=Strict; HttpOnly=true; Expires=${
        Date.now() + 7 * 24 * 60 * 60 * 1000
      }`,
    });
    res.end(JSON.stringify({ error: false, csrfToken }));
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

/**
 *
 * @path /logout
 * @method DELETE
 */
export const logout = async (req, res) => {
  const csrfToken = req.headers['csrftoken'];
  const { authToken } = parseCookies(req);

  try {
    await new SessionsRepository().deleteSession(req.userId, csrfToken);

    res.writeHead(200, {
      'Content-type': 'application/json',
      'Set-Cookie': `authToken=${authToken}; SameSite=Strict; HttpOnly=true; Expires=${new Date(
        0
      )})}`,
    });
    res.end(
      JSON.stringify({
        error: false,
        message: `User ${req.userId} logged out successfully.`,
      })
    );
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

export const checkAuth = async (req, res, next) => {
  const { authToken } = parseCookies(req);

  if (!authToken) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({
        error: true,
        message: 'Missing the cookie with authorization token.',
      })
    );
  }

  try {
    const payload = verify(authToken, process.env.ACCESS_SECRET_KEY);
    req.userId = payload.id;
    next();
  } catch (err) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(JSON.stringify({ error: true, message: err.message }));
  }
};

export const requireAuth = async (req, res, next) => {
  const { authToken } = parseCookies(req);
  const csrfToken = req.headers['csrftoken'];

  if (!authToken || !csrfToken) {
    res.writeHead(401, { 'Content-type': 'application/json' });
    return res.end(
      JSON.stringify({
        error: true,
        message: 'Missing one or both of the authorization tokens.',
      })
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
