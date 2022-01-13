import FluidRouter from '../FluidRouter';
import User from './User';
import protect from '../middleware/access.middleware';

const router = FluidRouter.getInstace();

router.route('/user/register').post(User.createUser);
router.route('/user/login').post(User.login);
router.route('/user').patch(protect as any, User.updateUser);

export default router;