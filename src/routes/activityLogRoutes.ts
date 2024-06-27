import { Router, Request, Response } from 'express';
import { getActivitiesLog } from '../controllers/activityLogController';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => getActivitiesLog(req, res));

export default router;