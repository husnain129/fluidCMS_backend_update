import FluidRouter from '../FluidRouter';
import Field from './Field';
import access from '../middleware/access.middleware';
import { AccessToken } from '../Types/enums';

const router = FluidRouter.getInstace();

router.route('/field/:model_alias').post(access(AccessToken.FULL), Field.createField);

router
	.route("/field/all/:model_alias")
	.get(access(AccessToken.READ), Field.getAllFields);

// ALL Blow route have to pass Field alias
// Model alias in params

router
	.route("/field/:alias/:model_alias")
	.get(access(AccessToken.READ), Field.getOneField);

export default router;

