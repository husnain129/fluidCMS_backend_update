import FluidRouter from '../FluidRouter';
import User from './User';
import auth from '../middleware/auth.middleware';

const router = FluidRouter.getInstace();

router.route('/user/register').post(User.createUser);
router.route('/user/login').post(User.login);
router.route('/user').patch(auth as any, User.updateUser);
router.route('/user/password').patch(auth as any, User.updatePassword);
router.route("/user/profile").patch(auth as any, User.postUserImage);

export default router;