const express = require("express");
const router = express.Router();

const validatSchema = require("../middlewares/joi");
const cleanupData = require("../middlewares/cleanupData");

const {
  addCart,
  updateCart,
  getCart,
  deletCart,
  clearCart,
} = require("../controllers/cart");

router
  .route("/")
  .get(getCart)
  .patch(cleanupData, updateCart)
  .post(cleanupData, addCart)
  .delete(clearCart);

router.route("/:id").delete(deletCart);

module.exports = router;
