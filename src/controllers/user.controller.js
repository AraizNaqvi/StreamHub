// Importing the async handler that is a super function
import { apiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
    



const registerUser = asyncHandler(async (req, res) => {
    // getting user details from front end
    const {fullName, username, email, password} = req.body;
    

    // validation - not empty, etc
    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new apiError(400, "Missing Field/s");
    }


    // check if user already exists - username, email
    const existingUser = User.findOne({
        $or: [{username}, {email}]
    })
    if(existingUser) throw new apiError(409, "User with same email/username already exists")


    // Check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0].path;

    if(!avatarLocalPath) throw new apiError(400, "Avatar Missing")
 

    // Upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new apiError(400, "Avatar File is Required");

    // Create user object - create entry in DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()
    })
    const userPresent = await User.findById(user._id).select("-password -refreshToken");
    if(!userPresent) throw new apiError(500, "Something went wrong while registration.")


    return res.status(201).json(new apiResponse(200, userPresent, "User Registered Successfully"))
    // Remove password and refresh token field from response
    // Check for user creation
    // Return response else return error

})

export {registerUser};