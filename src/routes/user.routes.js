// Import the Router and use the register user.
import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";


// Then we simply create a route suffix after it has been exported to app.js so that when /(any route)
// suffix is used then that particular route is called.
// When a post request is called for /register using multer's upload
// we use .fields since .fields allows us to select multiple files from same form and we give 2 objects with name i.e. the name of the file it should expect and maxCount is the number of files it shall receive
// registerUser is the function that will be able to use it.
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