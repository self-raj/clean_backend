import {  loginAdmin, registerAdmin } from "../controller/adminRegister.controller.js";

export function adminRoutes(app) {
    app.post("/api/admin/register", registerAdmin);
    app.post("/api/admin/login", loginAdmin);
}
    