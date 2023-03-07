import { Router } from 'express';
import { auth } from './middleware/auth';
import { TodoRouter } from './modules/todo/router';
import { UsersRouter } from './modules/users/router';

const router = Router();

router.use(UsersRouter);
router.use(auth, TodoRouter);

export default router;
