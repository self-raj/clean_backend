// import { verify } from "crypto";
import { deleteSliderImage, getAllSliderImages, sliderController, updateSliderImage } from "../controller/slider.controller.js";
import upload from "../utils/multer.js";


export function createSlider(app) {
  app.post("/slider", upload.array("images", 10),  sliderController);
  app.get("/Allslider",  getAllSliderImages);
  app.delete("/deleteslider",  deleteSliderImage);
app.put("/updateslider", upload.single("images"),  updateSliderImage);
 

}
