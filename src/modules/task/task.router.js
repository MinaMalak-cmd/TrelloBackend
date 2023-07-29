import {Router} from 'express';
import * as taskController from './controllers/task.js';
import handleAuth from '../../middlewares/handleAuth.js';

const router = Router();

router.get('/', taskController.getAllTasksWithUserData);
router.get('/current-user-tasks', handleAuth, taskController.getAllTasksForCurrentUser);
router.get('/any-user-tasks/:id', taskController.getAllTasksForAnyUser);
router.post('/', handleAuth, taskController.addTask);
router.put('/:id', handleAuth, taskController.updateTask);
router.delete('/:id', handleAuth, taskController.deleteTask);

export default router;