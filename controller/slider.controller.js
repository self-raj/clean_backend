import uploadImage, { deleteImage } from "../utils/uploadImage.js";
import fs from "fs";
import sliderModel from "../model/slider.model.js";
import upload from "../utils/multer.js";






// miltiple image upload for slider
export async function sliderController(req, res) {

  
 try {
    const files = req.files;
    console.log(files, "files");
    

//     // Validate minimum 5 images per request
    if (!files || files.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least 1 image per request",
      });
    }

//     // Upload images to Cloudinary
    const uploadedImages = [];
    for (const file of files) {
      const result = await uploadImage(file.path); // returns { public_id, url }
      uploadedImages.push({ public_id: result.public_id, url: result.url });
      fs.unlinkSync(file.path); // remove temp file
    }

//     // Find existing slider document
    let slider = await sliderModel.findOne();

    if (slider) {
//       // Append new images to existing slider
      slider.images.push(...uploadedImages);
      await slider.save();
      return res.json({
        success: true,
        message: "Images added to existing slider",
        data: slider,
      });
    } else {
      // Create new slider if none exists
      slider = new sliderModel({ images: uploadedImages });
      await slider.save();
      return res.json({
        success: true,
        message: "Slider created with images",
        data: slider,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}




// Fetch all slider images (flattened array)
export async function getAllSliderImages(req, res) {
  try {
    // MongoDB se images field fetch karo
    const sliders = await sliderModel.find({}, { images: 1, _id: 0 });

    // Flatten array → ek single array of objects [{ public_id, url }, ...]
    const allImages = sliders.flatMap(slider => slider.images);

    res.status(200).json({
      success: true,
      message: "All slider images fetched successfully",
      data: allImages
    });
  } catch (error) {
    console.error("Error fetching slider images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch slider images",
      error: error.message
    });
  }
}
// ===========delete single image========================


export async function deleteSliderImage(req, res) {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }

    // Cloudinary se delete
    await deleteImage(public_id);

    // DB se remove
    const slider = await sliderModel.findOneAndUpdate(
      {},
      { $pull: { images: { public_id } } },
      { new: true }
    );

    res.json({ success: true, message: "Image deleted successfully", data: slider });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ===============edit update=====================
export async function updateSliderImage(req, res) {
  try {
    const { public_id } = req.body;
    const newFile = req.file; // multer single upload: "image"

    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id required" });
    }

    // Find the slider document that contains this image
    const slider = await sliderModel.findOne({ "images.public_id": public_id });
    if (!slider) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Find the image inside the images array
    const imageIndex = slider.images.findIndex(img => img.public_id === public_id);

    if (imageIndex === -1) {
      return res.status(404).json({ success: false, message: "Image not found in document" });
    }

    // If new image uploaded, replace it
    if (newFile) {
      // Upload new image to Cloudinary
      const uploaded = await uploadImage(newFile.path);
      fs.unlinkSync(newFile.path);

      // Replace the old image in the array
      slider.images[imageIndex] = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
    }

    await slider.save();
    return res.json({ success: true, message: "Image updated successfully", data: slider });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
