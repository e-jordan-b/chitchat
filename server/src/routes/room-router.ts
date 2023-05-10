import { Router } from 'express';
import { createRoom } from '../controllers/room-controller';

const router = Router();

router.post('/create', createRoom);

export { router as roomRouter };
