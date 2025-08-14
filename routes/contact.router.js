import { createContact, getCurrentContact } from "../controller/contact.controller.js";
import { verify } from "../middleware/authMiddleware.js";


function contactRouter(app){
    app.post("/api/contact", createContact);
    app.get("/api/contact" ,  getCurrentContact);
}

export default contactRouter;   