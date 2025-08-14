import jwt from "jsonwebtoken";
import adminModel from "../model/admin.model.js";
export function verify(req, res, next) {
  if (
    !req.headers ||
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "JWT"
  ) {
    return res.status(401).json({ message: "User not logged in" }); //  Token missing case
  }

  //
  try {
    var decode = jwt.verify(
      req.headers.authorization.split(" ")[1],
      "secretKey",
      (err, verifyToken) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token", err });
        }
        //   Token verified — find user
        console.log("verifyToken.id", verifyToken.id);
        adminModel.findById(verifyToken.id).then((verifyUser) => {
          if (!verifyUser) {
            return res.status(404).json({ message: "User not found" });
          }

          
          console.log(verifyUser, "user with verify token");//sb kuch sahi hone par user ka all details show karega log me
            // Set user to req
        //     req.verifyUser = verifyUser;
        //    req.userId = verifyUser._id.toString(); // this line is important for delete logic
          next()
        });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
