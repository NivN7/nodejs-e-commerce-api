import express from "express";

import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/product-controller";
import {
  authenticateUser,
  authorizePermission,
} from "../middleware/authentication";
import { getSingleProductReviews } from "../controllers/review-controller";

const router = express.Router();

router
  .route("/")
  .post([authenticateUser, authorizePermission("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermission("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission("admin")], updateProduct)
  .delete([authenticateUser, authorizePermission("admin")], deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

export default router;
