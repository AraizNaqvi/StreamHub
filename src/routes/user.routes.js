// Import the Router and use the register user.
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";


// Then we simply create a route suffix after it has been exported to app.js so that when /(any route)
// suffix is used then that particular route is called.
router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser);

export default router;