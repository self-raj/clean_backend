import aboutModel, { aboutContentModel } from "../model/about.model.js";
import uploadImage from "../utils/uploadImage.js";
import fs from "fs";
// about vision ka controller save kane ka 
export async function aboutController(req, res) {
  try {
    const { content } = req.body;
    const imagePath = req.file?.path;

    console.log(imagePath, content, "image path");

    let imageUrl = null;
    if (imagePath) {
      const uploaded = await uploadImage(imagePath); // Cloudinary upload
      imageUrl = uploaded.url; // Sirf URL pick kiya
      fs.unlinkSync(imagePath); // Local se delete
    }

    // Pehle existing document dhundo
    let about = await aboutModel.findOne();

    if (about) {
      about.content = content;
      if (imageUrl) about.image = imageUrl;
      await about.save();

      return res.json({
        success: true,
        message: "About content updated",
        data: about
      });
    } else {
      const newAbout = new aboutModel({
        content,
        ...(imageUrl && { image: imageUrl })
      });
      await newAbout.save();

      return res.json({
        success: true,
        message: "About content created",
        data: newAbout
      });
    }
  } catch (err) {
    console.error("Cloudinary Upload/Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

//================= vision ka get karega content image===========
export async function getAboutController(req, res) {
  try {
    const about = await aboutModel.findOne();
    if (!about) {
      return res.status(404).json({ success: false, message: "About content not found" });
    }

    return res.json({
      success: true,
      data: {
        content: about.content,
        image: about.image
      }
    });
  } catch (err) {
    console.error("Error fetching about content:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}




// =============== aboutcontent=============================


export async function aboutContent(req, res) {
  try {
    let { title, content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required"
      });
    }

    // Word count check
    const wordCount = content.trim().split(/\s+/).length;

    if (wordCount > 120) {
      return res.status(400).json({
        success: false,
        message: `Content exceeds 120 words (currently ${wordCount} words)`
      });
    }

    // Save to DB (अगर पहले से है तो update, वरना नया create)
    let about = await aboutContentModel.findOne();
    if (about) {
      about.title = title || about.title;
      about.content = content;
      await about.save();
    } else {
      about = new aboutContentModel({ title, content });
      await about.save();
    }

    res.json({
      success: true,
      message: "About content saved successfully",
      data: about
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


// ========================= getabout content company titile=============================
export async function getAboutcontent(req, res) {
  try {
    const aboutData = await aboutContentModel.findOne();
    if (!aboutData) {
      return res.status(404).json({ success: false, message: "About content not found" });
    }

    res.status(200).json({
      success: true,
      data: aboutData
    });

  } catch (error) {
    console.error("About Fetch Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
