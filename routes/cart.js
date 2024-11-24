const express = require("express");
const router = express.Router();

const validatSchema = require("../middlewares/joi");
const cleanupData = require("../middlewares/cleanupData");

const {
  cartSchema,
  cartsSchema,
} = require("../utilities/validators/cartSchema");

const { addCart, deletCart, getCart } = require("../controllers/cart");

router
  .route("/")
  .get(getCart)
  .post(cleanupData, validatSchema(cartSchema), addCart)
  .delete(deletCart);

router.route("/all").post(cleanupData, validatSchema(cartsSchema), addCart);

router.route("/:id").delete(deletCart);

module.exports = router;
