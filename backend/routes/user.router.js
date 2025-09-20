import express from "express"
import { signup } from "../controllers/user.controller.js";

import { checkAuth, checkAdmin } from "../middleware/auth.middleware.js"


const router = express.Router();

router.post("/signup", signup);

export default router