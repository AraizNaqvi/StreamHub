import {asyncHandler} from '../utils/asyncHandler.utils.js';
import { apiError } from '../utils/apiError.utils.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.utils.js';
import { apiResponse } from '../utils/apiResponse.utils.js';

const registerUser = asyncHandler(async (req, res) => {
    const {username, fullName, email, password} = req.body;
    console.log(`Email: ${email}`);

    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new apiError(400, "All Fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser) throw new apiError(409, "User with email or username already exists")

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) throw new apiError(400, "Avatar file is required");
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) throw new apiError(400, "Avatar file is required");

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) throw new apiError(500, "Something went wrong while registering user.");

    return res.status(201).json(new apiResponse(200, createdUser, "User registered successfully"))
})

export {registerUser};