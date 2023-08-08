import {Router} from 'express';
import * as userController from './controllers/user.js';
import handleAuth from '../../middlewares/handleAuth.js';
import * as validators from './user.validation.js';
import { validation } from "../../middlewares/validation.js";

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/profile', handleAuth, userController.getUserProfile);
router.put('/update/:id', validation(validators.updateUser) ,handleAuth, userController.updateUser);
router.delete('/:id', handleAuth, userController.deleteUser);
router.delete('/soft-delete/:id', handleAuth, userController.softDelete);

export default router; 