import { Router, Request, Response } from 'express';
import { addMagicItem } from '../controllers/magicItemController';

const router: Router = Router();

router.post('/', (req: Request, res: Response) => addMagicItem(req, res));

export default router;