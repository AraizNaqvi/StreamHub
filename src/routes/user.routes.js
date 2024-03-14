// Import the Router and use the register user.
import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


// Then we simply create a route suffix after it has been exported to app.js so that when /(any route)
// suffix is used then that particular route is called.
// When a post request is called for /register using multer's upload
// we use .fields since .fields allows us to select multiple files from same form and we give 2 objects with name i.e. the name of the file it should expect and maxCount is the number of files it shall receive
// registerUser is the function that will be able to use it.
router.route('/register').post(upload.fields([
    {
        name: "coverImage",
        maxCount: 1
    },
    {
        name: "avatar",
        maxCount: 1
    }
]), registerUser);

router.route("/login").post(loginUser)

// Secured Routes
router.route('/logout').post(verifyJWT, logoutUser)

router.route('/refresh-token').post(refreshAccessToken)

export default router;