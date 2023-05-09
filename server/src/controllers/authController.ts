import { Request, Response } from 'express';
import { ErrorMessage } from '../models/error-message';
import { create } from '../models/user-model';
import { signToken } from '../services/token-service';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send(ErrorMessage.Error400);
    return;
  }

  const { user, error } = await create(email, password);

  if (error || !user) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  // Token
  const token = signToken(user._id as string, user.email);

  if (!token) {
    res.status(500).send(ErrorMessage.Error500);
  }

  res.cookie('authToken', token, {
    httpOnly: true,
  });

  res.status(200).json(user)
};

export const signin = (req: Request, res: Response) => {};
