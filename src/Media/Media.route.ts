import FluidRouter from '../FluidRouter';
import Media from './Media';
import extensionChecker from '../middleware/extensionChecker.middleware'
import access from '../middleware/access.middleware'
import { AccessToken } from "../Types/enums";

const router = FluidRouter.getInstace();


router
	.route("/image")
	.post(extensionChecker as any, access(AccessToken.FULL), Media.uploadImage);

router.route("/media/:id").get(access(AccessToken.READ), Media.getImage);

router
	.route("/image/:id")
	.patch(extensionChecker as any, access(AccessToken.FULL),Media.updateImage);


export default router;
