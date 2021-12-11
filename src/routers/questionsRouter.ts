import { Router } from 'express';

import * as questionsController from '../controllers/questionsController';
import validateToken from '../middlewares/authorization';

const router = Router();

router.post('', questionsController.createNewQuestion);
router.post('/:id', validateToken, questionsController.answerQuestion);
router.get('/:id', questionsController.getQuestionById);
router.get('', questionsController.getUnansweredQuestions);

export default router;
