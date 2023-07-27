import {Router} from 'express';
import * as authController from './controllers/auth.js';
import handleAuth from '../../middlewares/handleAuth.js';

const router = Router();

router.post('/signup', authController.signup);
router.patch('/change-password', handleAuth, authController.changePassword);
router.post('/login', authController.login);


export default router;