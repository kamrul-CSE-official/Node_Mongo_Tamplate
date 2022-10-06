const {
  getProductsService,
  createProductService,
  updateProductService,
  bulkUpdateProductService,
  deleteProductByIdService,
  bulkDeleteProductService,
} = require("../services/products.services");

exports.getProducts = async (req, res, next) => {
  try {
    //{price: {$ gt: 50}}
    //{price: {gt: '50'}}
    console.log(req.query);

    let filters = { ...req.query };

    //sort, page, limit -> exclude

    const excludeFields = ["sort", "page", "limit"];
    excludeFields.forEach((field) => delete filters[field]);

    //gt, lt, gte, lte
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );

    filters = JSON.parse(filtersString);

    const queries = {};

    if (req.query.sort) {
      //price, quantity -> 'price,quantity'
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
      console.log(sortBy);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
      console.log(fields);
    }
    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;
      //50 products
      //each page 10 products
      //page 1 = 1 - 10
      //page 2 = 10 - 20
      //page 3 = 20 - 30 ---> page 3 ---> skip 1-20 = 3-1 = 2 * 10
      //page 4 = 30 - 40 ---> page 4 ---> skip 1-30 = 4-1
      //page 5 = 40 - 50

      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }
    const products = await getProductsService(filters, queries);

    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Can't get the data",
      error: error.message,
    });
  }
};

exports.createProducts = async (req, res, next) => {
  try {
    //দুই ভাবে ডেটা ডেটাবেজে পাঠানো যাই save or create
    //Save এর ক্ষেত্রে নিচের নিয়ম
    const result = await createProductService(req.body);

    result.logger();

    //create এর ক্ষেত্রে নিচের নিয়ম
    /**
      const product = new Product(req.body);
  
      instance creation -> Do something -> save()
      if (product.quantity == 0) {
        product.status = "out-of-stock";
      }
       const result = await product.save();
      */

    res.status(200).json({
      status: "success",
      message: "Data inserted successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data not inserted",
      error: error.message,
    });
  }
};

exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await updateProductService(id, req.body);

    res.status(200).json({
      stauts: "success",
      message: "Successfully update the product",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't update this product",
      error: error.message,
    });
  }
};

exports.bulkUpdateProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await bulkUpdateProductService(req.body);

    res.status(200).json({
      stauts: "success",
      message: "Successfully update the product",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't update this product",
      error: error.message,
    });
  }
};

exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await deleteProductByIdService(id);

    if (!result.deletedCount) {
      return res.status(400).json({
        status: "fail",
        error: "Couldn't delete the product",
      });
    }

    res.status(200).json({
      stauts: "success",
      message: "Successfully deleted the product",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't deleted this product",
      error: error.message,
    });
  }
};

exports.bulkDeleteProduct = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await bulkDeleteProductService(req.body.ids);

    res.status(200).json({
      stauts: "success",
      message: "Successfully deleted the given products",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't delete the given product",
      error: error.message,
    });
  }
};
