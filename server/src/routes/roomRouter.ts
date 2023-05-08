import { Router } from 'express';
import { createRoom } from '../controllers/roomController';

const router = Router();

router.post('/room', createRoom);

export { router as roomRouter };
