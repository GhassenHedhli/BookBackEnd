import express from "express";
import {signup, login} from  "../controllers/user.js";
import loggedMiddleware from "../middlewares/auth.js";
const router = express.Router();
router.post("/signup",signup);
router.post("/login",loggedMiddleware,login);

export default router;
