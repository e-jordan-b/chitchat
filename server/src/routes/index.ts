import { authRouter } from './auth-router';
import { roomRouter } from './room-router';
import { userRouter } from './user-router';

const router = {
  room: roomRouter,
  auth: authRouter,
  user: userRouter,
};

export default router;
