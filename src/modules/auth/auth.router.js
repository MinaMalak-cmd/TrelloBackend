import {Router} from 'express';
import * as authController from './controllers/auth.js';

const router = Router();

router.post('/signup', authController.signup);
router.patch('/change-password', authController.changePassword);
router.post('/login', authController.login);


export default router;