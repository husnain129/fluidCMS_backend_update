import FluidRouter from '../FluidRouter';
import access from "../middleware/access.middleware";
import Model from './Model';

import { AccessToken } from "../Types/enums"
const router = FluidRouter.getInstace();

router.route("/project").post(access(AccessToken.FULL), Model.createModel);

export default router;