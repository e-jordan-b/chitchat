import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../models/authenticated-request';
import jwt from 'jsonwebtoken';
import { AuthToken } from '../models/auth-token';

const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const unrestrictedRoutes: string[] = [
    '/auth/signin',
    '/auth/signup',
    '/summary',
    '/summary/edit',
    '/room/validate',
  ];
  const unrestrictedRoute = unrestrictedRoutes.findIndex(
    (route) => req.path === route
  );
  if (unrestrictedRoute !== -1) {
    next();
    return;
  }

  // authToken is the name of the authentication cookie with JWT
  const { authToken } = req.cookies;

  if (!authToken) {
    res.status(401).send('MissingAuthToken');
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(400).send('ServerError');
    return;
  }

  const token = jwt.verify(authToken, secret) as AuthToken;

  req.token = token;
  next();
};

export default authMiddleware;
