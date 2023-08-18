import {Router} from 'express';
import * as userController from './controllers/user.js';
import handleAuth from '../../middlewares/handleAuth.js';
import * as validators from './user.validation.js';
import { validation } from "../../middlewares/validation.js";
import { multerUploadLocally } from "../../services/multerLocally.js";
import { multerCloudUpload } from "../../services/multerCloudinary.js";
import { allowedExtensions } from '../../utils/allowedExtensions.js';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:_id', userController.getUserData);

router.get('/profile', handleAuth, userController.getUserProfile);
// router.patch('/profile', handleAuth, multerUploadLocally(allowedExtensions.Image,'User/Test/Profile').fields([
//     {name : 'profile', maxCount : 1 }, 
// ]), userController.updateProfilePic); 
// router.patch('/cover', handleAuth, multerUploadLocally(allowedExtensions.Image,'User/Cover').fields([
//         {name : 'cover', maxCount : 4 }, 
//     ]), userController.updateCoverPictures);

router.patch('/profile', handleAuth, multerCloudUpload(allowedExtensions.Image).fields([
    {name : 'profile', maxCount : 1 }, 
]), userController.updateProfilePic); 
router.patch('/cover', handleAuth, multerCloudUpload(allowedExtensions.Image).fields([
        {name : 'cover', maxCount : 4 }, 
    ]), userController.updateCoverPictures);
router.patch('/cover-delete', handleAuth, userController.deleteCoverPictures);
router.put('/update/:id', validation(validators.updateUser) ,handleAuth, userController.updateUser);
router.delete('/:id', handleAuth, userController.deleteUser);
router.delete('/soft-delete/:id', handleAuth, userController.softDelete);

export default router; 