import { Router } from 'express';
import { editSummary, fetchSummaries } from '../controllers/summary-controller';

const router = Router();

router.get('/', fetchSummaries);

router.post('/edit', editSummary);

export { router as summaryRouter };
