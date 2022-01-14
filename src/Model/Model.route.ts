import FluidRouter from '../FluidRouter';
import access from "../middleware/access.middleware";
import Model from './Model';

import { AccessToken } from "../Types/enums"
const router = FluidRouter.getInstace();

router.route("/model").post(access(AccessToken.FULL), Model.createModel);
router.route("/model/all").get(access(AccessToken.READ), Model.getAllModel);
router.route("/model/:model_alias").get(access(AccessToken.READ), Model.getOneModel);
router.route("/model/:model_alias").delete(access(AccessToken.READ), Model.deleteModel);
router
	.route("/model/:model_alias")
	.patch(access(AccessToken.FULL), Model.updateModel);
	
export default router;