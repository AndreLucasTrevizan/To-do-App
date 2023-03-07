import { Router } from 'express';
import {
  handleCreateTodo,
  handleDeleteTodo,
  handleFinishingTodo,
  handleListTodo,
  handleUpdateTodo
} from './controller';

const router = Router();

router
  .route('/todo')
  .get(handleListTodo)
  .post(handleCreateTodo)
  .patch(handleUpdateTodo)
  .delete(handleDeleteTodo);

router.route('/todo/finish').patch(handleFinishingTodo);

export {router as TodoRouter};
