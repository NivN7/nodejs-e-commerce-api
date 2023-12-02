import express from "express";

import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/user-controller";

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/updateUserPassword").patch(updateUserPassword);

router.route("/:id").get(getSingleUser);

export default router;
