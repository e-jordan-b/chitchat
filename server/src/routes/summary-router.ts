import { Router } from 'express';
import { editSummary, fetchSummaries, getFinalSummary } from '../controllers/summary-controller';

const router = Router();

router.get('/', fetchSummaries);

router.post('/edit', editSummary);

router.get('/finalsummary', getFinalSummary);

export { router as summaryRouter };
