const express = require("express");
const router = express.Router();
const productControler = require("../Controllers/productControllers");

router.route("/bulk-update").patch(productControler.bulkUpdateProduct);
router.route("/bulk-delete").delete(productControler.bulkDeleteProduct);

router
  .route("/")
  .get(productControler.getProducts)
  .post(productControler.createProducts);

router
  .route("/:id")
  .patch(productControler.updateProductById)
  .delete(productControler.deleteProductById);

module.exports = router;
