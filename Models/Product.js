const mongoose = require("mongoose");
//schema design
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please provide a name for this product..."],
      trim: true, // অতিরিক্ত স্পেস কেটে পেলে
      unique: [true, "Name must be unique"],
      minLength: [3, "Name must be at least 3 characters"],
      maxLength: [100, "Name is too large"],
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
      min: [0, "Price can't be negative..."],
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "litre", "pcs"],
      enum: {
        values: ["kg", "litre", "pcs"],
        message: "unit value can't be {VALUE}, must be kg/litre/pcs",
      },
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity can't be negative"],
      validate: {
        validator: (value) => {
          const isInteger = Number.isInteger(value);
          if (isInteger) {
            return true;
          } else {
            return false;
          }
        },
      },
      message: "Qunatity must be an integer",
    },
    stauts: {
      type: String,
      requier: true,
      enum: {
        values: ["in-stock", "out-of-stock", "discontinued"],
        message: "statuse can't be {VALUE} ",
      },
    },
    //   createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
    //   updatedAt: {
    //     type: Date,
    //     detfault: Data.now,
    //   },
    suplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    categories: [
      {
        name: {
          type: String,
          required: true,
        },
        _id: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

//mongoose middlewares for saving data: pre/post

productSchema.pre("save", function (next) {
  console.log("Before saving data...".green.bold);
  if (Product.quantity == 0) {
    this.status = "out-of-stock";
  }

  next();
});

productSchema.post("save", function (doc, next) {
  console.log("After saving data...".green.bold);

  next();
});

productSchema.methods.logger = function () {
  console.log(`Data saved for ${this.name} `.gray.bold);
};

//SCHEMA -> MODEL -> QUERY

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
