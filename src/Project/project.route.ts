import FluidRouter from "../FluidRouter";
import Project from "./Project";
const router = FluidRouter.getInstace();

router.route("/project").post(Project.createProject);
router.route("/project").get(Project.getAllProjects);
router.route("/project/:id").get(Project.getOneProject);
router.route("/project/:id").patch(Project.updateProject);
router.route("/project/:id").delete(Project.deleteProject);
export default router;
