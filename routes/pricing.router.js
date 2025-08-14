import { deleteSingleItem, editSingleItem, getAllPricingData, savePricingData } from "../controller/pricing.controller.js";
import { verify } from "../middleware/authMiddleware.js";

export function pricingRouter(app) {
  app.post("/api/pricing",  savePricingData ) ;
  app.get("/api/categories" ,  getAllPricingData); 
  app.delete("/api/item/:itemId",   deleteSingleItem);
  app.put("/api/item/:itemId",   editSingleItem);
}
