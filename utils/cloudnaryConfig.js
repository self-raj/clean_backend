import { v2 as cloudinary } from 'cloudinary';

export  async function configureCloudinary() {
  try {
    await cloudinary.config({
    cloud_name: 'dvrwh4jx2',
    api_key: '954566634272691',
    api_secret: 'I7kn5vWlDwSC6pzBic96_sLayNw',
    secure: true
  });
  console.log("Cloudinary configured successfully");
  } catch (error) {
    console.error("Error configuring Cloudinary:", error);
  }
}


// export async function uploadImage(filePath) {
//   try {
//     const result = await cloudinary.uploader.upload(filePath);
//     console.log("Image uploaded at:", result.secure_url);
//     return result;
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//   }
// }
