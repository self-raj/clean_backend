import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema({
  images: [
    {
      public_id: { type: String, required: true },
      url: { type: String, required: true }
    }
  ]
}, { timestamps: true });

const sliderModel = mongoose.model("Slider", sliderSchema);

export default sliderModel;
