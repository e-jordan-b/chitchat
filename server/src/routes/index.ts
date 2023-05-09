import { authRouter } from './authRouter';
import { roomRouter } from './roomRouter';

const router = {
  room: roomRouter,
  auth: authRouter,
};

export default router;
