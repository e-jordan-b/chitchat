import { Request, Response } from 'express';
import { ErrorMessage } from '../models/error-message';
import { create, findUserByEmail } from '../models/user-model';
import { signToken } from '../services/token-service';
import bcrypt from 'bcrypt';

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

  res.status(200).json(user);
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('BadData');
    return;
  }

  try {
    const { user, error } = await findUserByEmail(email);

    if (error) {
      res.sendStatus(500);
      return;
    }

    if (!user) {
      res.status(400).send('NoUser');
      return;
    }

    const passMatch = await bcrypt.compare(password, user.password!);

    if (!passMatch) {
      res.status(401).send('IncorrectPassword');
      return;
    }

    // Create JWT token
    const token = signToken(user._id as string, user.email);

    if (!token) {
      res.status(500).send('ServerError');
      return;
    }

    // Should refresh token
    res.cookie('authToken', token, {
      httpOnly: true,
    });

    res.status(200).json({
      _id: user._id,
      email: user.email,
      createdRooms: user.createdRooms,
      participatedRooms: user.participatedRooms,
    });
  } catch (error) {
    console.log('authController/signin error:', error);
    res.sendStatus(500);
  }
};


export const signout = async (_: Request, res: Response) => {
  res.cookie('authToken', '', {
      expires: new Date(0),
      httpOnly: true,
  })
  res.status(200).json({ success: true, message: 'User logged out successfully' })
}