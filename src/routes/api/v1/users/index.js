import { Router } from "express";
import checkAuth from "middlewares/checkAuth";
// import { updatePassword } from "./user.validators";
import controller from "./user.controller";

const router = Router();

// router.use(checkAuth());

router.get("/", controller.getCurrentUser);
router.get("/campaigns", controller.getCurrentUserCampaigns);

router
  .route("/update-password")
  .put(updatePassword, checkAuth(), controller.updatePassword);

router
  .route("/:user")
  .put(
    checkAuth(),
    controller.checkRecord(),
    controller.hashPwd(),
    controller.updateOne()
  );

export default router;
