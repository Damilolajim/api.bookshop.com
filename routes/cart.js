const express = require("express");
const router = express.Router();

const validatSchema = require("../middlewares/joi");
const cleanupData = require("../middlewares/cleanupData");

const {
  cartSchema,
  checkoutSchema,
} = require("../utilities/validators/cartSchema");

const {
  addCart,
  deleteCart,
  getCarts,
  getCart,
  checkout,
} = require("../controllers/cart");

router
  .route("/")
  .get(getCarts)
  .post(cleanupData, validatSchema(cartSchema), addCart)
  .delete(deleteCart);

router
  .route("/checkout")
  .post(cleanupData, validatSchema(checkoutSchema), checkout);

router.route("/:id").get(getCart).delete(deleteCart);

module.exports = router;
