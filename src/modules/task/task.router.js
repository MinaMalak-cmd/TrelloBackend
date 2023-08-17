import {Router} from 'express';
import * as taskController from './controllers/task.js';
import handleAuth from '../../middlewares/handleAuth.js';
import { multerUploadLocally } from "../../services/multerLocally.js";
import { allowedExtensions } from '../../utils/allowedExtensions.js';

const router = Router();

const allowedAttachmentsExtensions = [...allowedExtensions.Image, ...allowedExtensions.Files, allowedExtensions.Files ]

router.get('/', taskController.getAllTasksWithUserData);
router.get('/current-user-tasks', handleAuth, taskController.getAllTasksForCurrentUser);
router.get('/any-user-tasks/:id', taskController.getAllTasksForAnyUser);
router.get('/failed-tasks', taskController.getTasksPassedDeadline);
router.post('/', handleAuth, taskController.addTask);
router.put('/:id', handleAuth, taskController.updateTask);
router.patch('/upload-attachment/:id', handleAuth, multerUploadLocally(allowedAttachmentsExtensions,'Task/Attachments').fields([
    {name : 'attachment', maxCount : 4 }
]), taskController.uploadTaskAttachment);
router.delete('/:id', handleAuth, taskController.deleteTask);

export default router;