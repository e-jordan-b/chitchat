import { Response } from 'express';
import { AuthenticatedRequest } from '../models/authenticated-request';
import { ErrorMessage } from '../models/error-message';
import { create } from '../models/room-model';
import { addRoomToUser } from '../models/user-model';

export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  const { agenda } = req.body;
  console.log({agenda});

  if (!agenda) {
    res.status(400).send(ErrorMessage.Error400);
    //can we do res.status(400).json({message: "meaningful message"); ?
    return;
  }

  const token = req.token;

  if (!token) {
    res.status(500).send(ErrorMessage.Error500);
    return;
  }

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
