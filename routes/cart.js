const express = require("express");
const router = express.Router();

const validatSchema = require("../middlewares/joi");
const cleanupData = require("../middlewares/cleanupData");

const {
  cartSchema,
  cartsSchema,
} = require("../utilities/validators/cartSchema");

const {
  addCart,
  deleteCart,
  getCarts,
  getCart,
} = require("../controllers/cart");

router
  .route("/")
  .get(getCarts)
  .post(cleanupData, validatSchema(cartSchema), addCart)
  .delete(deleteCart);

router.route("/all").post(cleanupData, validatSchema(cartsSchema), addCart);

router.route("/:id").get(getCart).delete(deleteCart);

module.exports = router;
