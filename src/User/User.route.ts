import FluidRouter from '../FluidRouter';
import User from './User';

const router = FluidRouter.getInstace();

router.route('/user/register').post(User.createUser);
router.route('/user/login').post(User.login);

export default router;