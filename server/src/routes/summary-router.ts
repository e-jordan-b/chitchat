import { Router } from 'express';
import { editSummary, fetchSummaries, getFinalSummary, getSummariesByUserId } from '../controllers/summary-controller';

const router = Router();

router.get('/', fetchSummaries);

router.post('/edit', editSummary);

router.get('/finalsummary', getFinalSummary);

router.get('/getusersummaries', getSummariesByUserId);

export { router as summaryRouter };
