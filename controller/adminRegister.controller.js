import adminModel from "../model/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function registerAdmin(req, res) {
  try {
    const { username ,email,password,  } = req.body;

    if (!username|| !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
  // Password strength validation using regex
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                if (!passwordRegex.test(password)) {
                  return res.status(400).json({
                    message:
                      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
                    success: false,
                  });
                }
    // this code check that user exist in collection userModel
    const userExist = await adminModel.findOne({ email });
    console.log(userExist);

    if (userExist) {
      return res
        .status(404)
        .json({ message: "User all ready exist ", success: false });
    }
    // password hashing code write here
    let hashPassword = bcrypt.hashSync(password, 10);
    // after bcrypt  password save data base
    const newUser = await adminModel.create({
      username,
      email,
      password: hashPassword, // use correct field
    });
    console.log(newUser, "newUser");
    res.status(200).json({
      message: "user Register Successful ",
      success: true,
    //   user: newUser,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message, success: false });
  }
}

// login logic code here

export async function loginAdmin(req, res) {
  try {
    console.log("Login controller called");
    const { email, password } = req.body;
    const user = await adminModel.findOne({ email });
    if (!password || !email) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    //  if user exist not in data base in login time
    if (!user) {
      return res
        .status(404)
        .json({ message: "User  is not registered ", success: false });
    }
    //  user is exist in database check password
    let vaild = bcrypt.compareSync(password, user.password);
    if (!vaild) {
      return res.status(404).json({ error: " Invaild Password" });
    }
   

    // create a token
    const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "30d" });
    // console.log(user); // console in user (optional, but its a good practice according to Samarth  sir)
    console.log("token", token);

    return res.status(200).json({
      message: "user logged-in successfully!",
      success: true,
      token,
      user
    });
  } catch (error) {
    res.status(404).json({ error: error.message, success: false });
  }
}