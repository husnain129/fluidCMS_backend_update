import FluidRouter from "../FluidRouter";
import Project from "./Project";
const router = FluidRouter.getInstace();

router.route("/project").post(Project.createProject);
router.route("/project/all").get(Project.getAllProjects);
router.route("/project/update/:id").get(Project.updateProject);
router.route("/project/:id").get(Project.getOneProject);
export default router;
