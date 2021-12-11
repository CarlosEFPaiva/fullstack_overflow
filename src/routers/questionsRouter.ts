import { Router } from 'express';

import * as questionsController from '../controllers/questionsController';
import validateToken from '../middlewares/authorization';

const router = Router();

router.post('', questionsController.createNewQuestion);
router.post('/:id', validateToken, questionsController.answerQuestion);

export default router;
