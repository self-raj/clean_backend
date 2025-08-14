import { v2 as cloudinary } from "cloudinary";

async function uploadImage(imagePath) {
    // configureCloudinary();
    // console.log("object");
    
  try {
    const result = await cloudinary.uploader.upload(imagePath,{
        folder: "about_image",
        resource_type: "image",
    });
    console.log(result);
    return {
      public_id: result.public_id,
      url: result.secure_url
    };
    // console.log(result, "result")
  } catch (error) {
    console.error("Cloudinary Upload/Error:", error);

  }
}
export async function deleteImage(public_id) {
  try {
    if (!public_id ) throw new Error("public_id is required to delete image");

    const result = await cloudinary.uploader.destroy(public_id , {
      resource_type: "image",
    });

    console.log("Cloudinary delete result:", result);
    return result; // returns { result: 'ok' } if deleted successfully
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error; // propagate error
  }
}

export default uploadImage;
