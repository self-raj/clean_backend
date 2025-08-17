import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import connectDB from "./db.js";  
import contactRouter from "./routes/contact.router.js";
import { adminRoutes } from "./routes/admin.router.js";
import { pricingRouter } from "./routes/pricing.router.js";
import { configureCloudinary } from "./utils/cloudnaryConfig.js";
import { aboutPage } from "./routes/about.routes.js";
import { createSlider } from "./routes/slider.router.js";
dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // agar cookies ya JWT use ho rahe ho
}));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

connectDB();


  app.get("/", (req, res) => {
  res.send("Welcome to the cleaanziia");
});
 
contactRouter(app);
pricingRouter(app);
adminRoutes(app);
aboutPage(app);
createSlider(app);

configureCloudinary();



app.listen(PORT, () => {
  console.log(`Server is running on${PORT}`);
});
