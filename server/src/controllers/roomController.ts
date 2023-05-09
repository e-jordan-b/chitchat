import { Response } from 'express';
import { AuthenticatedRequest } from '../models/authenticated-request';
import { ErrorMessage } from '../models/error-message';
import { create } from '../models/room-model';
import { addRoomToUser } from '../models/user-model';

export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { agenda } = req.body;

  const token = req.token;

  if (!token) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  console.log('passed');

  const { room, error: createError } = await create(agenda);

  if (createError || !room) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  const { success, error: addError } = await addRoomToUser(token.id, room._id);

  if (addError || !success) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

  res.status(200).json({ url: room.urlUUID });
};
