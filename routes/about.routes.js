import { aboutContent, aboutController,  getAboutcontent,  getAboutController } from "../controller/about.controller.js";
import { verify } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";


export function aboutPage(app) {
  //about vision ka api hai
  app.post("/about",  upload.single("image") ,aboutController);
  app.get("/about", getAboutController) ;

  // about content ka api hai
  app.post("/about/content", verify,aboutContent);
  app.get("/about/content",  getAboutcontent);
}
  