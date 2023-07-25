import {Router} from 'express';
import * as postController from './controllers/post.js';

const router = Router();

router.get('/', postController.getAllPosts);
router.get('/details', postController.getAllPostsWithOwner);
router.get('/sort', postController.getAllPostsSorted);
router.post('/', postController.addPost);
router.put('/:postId/:userId', postController.updatePost);
router.delete('/:postId/:userId', postController.deletePost);


export default router;
