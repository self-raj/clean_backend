import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  item: String,
  price: String
});

const categorySchema = new mongoose.Schema({
  categoryName: String,
  items: [itemSchema]
});

const pricingModel = mongoose.model('Category', categorySchema);

export default pricingModel;
