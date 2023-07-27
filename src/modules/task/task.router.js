import {Router} from 'express';
import * as taskController from './controllers/task.js';
import handleAuth from '../../middlewares/handleAuth.js';

const router = Router();

router.post('/', handleAuth, taskController.addTask);
router.get('/', taskController.getAllTasksWithUserData);
router.put('/:id', handleAuth, taskController.updateTask);
// router.delete('/:id', handleAuth, taskController.deleteUser);
// router.delete('/soft-delete/:id', handleAuth, taskController.softDelete);

export default router;