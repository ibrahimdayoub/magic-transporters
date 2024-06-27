import { Router, Request, Response } from 'express';
import { addMagicMover, loadMagicMover, startMission, endMission, getTopMovers } from '../controllers/magicMoverController';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => addMagicMover(req, res));
router.post('/:id/load', (req: Request, res: Response) => loadMagicMover(req, res));
router.post('/:id/start', (req: Request, res: Response) => startMission(req, res));
router.post('/:id/end', (req: Request, res: Response) => endMission(req, res));
router.get('/top', (req: Request, res: Response) => getTopMovers(req, res));

export default router; 