import {Router} from 'express';
import * as userController from './controllers/user.js';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserProfile);
router.get('/filter-by', userController.getByNameAndAge);
router.get('/filter-age', userController.getAgeBetween);
router.put('/update/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;