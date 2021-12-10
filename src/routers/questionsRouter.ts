import { Router } from 'express';

import * as questionsController from '../controllers/questionsController';

const router = Router();

router.post('', questionsController.createNewQuestion);

export default router;
