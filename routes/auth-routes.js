import express from "express";
const router = express.Router();
// const authController = require("../controllers/auth.js");
import {verifyOtp, initiateLogin, logout, logoutAll} from "../controllers/auth.js";
import { validateAuthorization } from "../utils/auth-validation.js";

router.post("/verify-otp", verifyOtp);

router.post("/login", initiateLogin);

router.post("/logout", validateAuthorization(), logout);

router.post("/logout-all", validateAuthorization(), logoutAll);

export default  router;
