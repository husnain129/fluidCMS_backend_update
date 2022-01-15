import Record from './Record';
import FluidRouter from '../FluidRouter';
import access from '../middleware/access.middleware';
import { AccessToken } from '../Types/enums';

const router = FluidRouter.getInstace();

router.route("/record/:model_alias").post(access(AccessToken.FULL), Record.createRecord);

router
	.route("/record/all/:model_alias")
	.get(access(AccessToken.FULL), Record.getAllRecords);

router.route("/record/:id").get(access(AccessToken.READ), Record.getOneRecord);

export default router;