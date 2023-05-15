import { Response } from 'express';
import { AuthenticatedRequest } from '../models/authenticated-request';
import { ErrorMessage } from '../models/error-message';
import { findUserById } from '../models/user-model';

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const token = req.token;

  if (!token) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  const { user, error } = await findUserById(token.id);

  if (error || !user) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  res.cookie('authToken', token, {
    httpOnly: true,
  });

  res.status(200).json(user);
};
