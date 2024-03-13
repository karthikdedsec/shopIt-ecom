import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://karthik:8OoH3FUhmblNyZHn@shopit.duyfmkb.mongodb.net/shopIt-v1?retryWrites=true&w=majority&appName=shopIt"
    );

    await Product.deleteMany();

    console.log("products deleted");

    await Product.insertMany(products);

    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
