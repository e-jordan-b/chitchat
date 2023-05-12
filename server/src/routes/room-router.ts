import { Router } from 'express';
import { createRoom, validateRoom } from '../controllers/room-controller';

const router = Router();

router.post('/create', createRoom);

router.post('/validate', validateRoom);

export { router as roomRouter };
