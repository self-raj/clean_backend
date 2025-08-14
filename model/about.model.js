import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    
    content: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String, // yaha Cloudinary ka URL ya koi image URL store hoga
      default: false
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } // ye automatic createdAt & updatedAt set karega
);

const aboutModel = mongoose.model("About", aboutSchema);

export default aboutModel;





const aboutContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  
}, { timestamps: true });
 
export const aboutContentModel = mongoose.model("AboutContent", aboutContentSchema);
