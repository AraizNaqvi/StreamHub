// Importing the async handler that is a super function
import { apiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import jwt from "jsonwebtoken";
    



const registerUser = asyncHandler(async (req, res) => {
    // 1. getting user details from front end
    const {fullName, username, email, password} = req.body;
    


    // 2. validation - not empty, etc
    // ? means that if it returns to be
    // null then it will exit else it will execute. 
    // Here we set in an array all possible inputs and use the some()
    // which checks for true. So when field is passed it it traverses
    // through all array elements(fields) and trims it. If it is true
    // then it throws an apiError of 400 Missing Fields.
    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new apiError(400, "Missing Field/s");
    }


    
    // 3. check if user already exists - username, email
    // The User model which has access to mongoose is set to find one
    // similar instance of either username or email. If this returns true
    // then it means that another instance using the same username and email
    // was found. Hence, we return apiError.
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existingUser) throw new apiError(409, "User with same email/username already exists")



    // 4. Check for images, check for avatar
    // Here req.files is like req.body just that it is provided by
    // multer to access files provided. From the name we gave in user.routes
    // we gave names 'avatar' and 'coverImage' for expected files.
    // Each of these names' first i.e. 0th object holds the path.
    // If it is true then true returns else false
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    console.log(`Avatar Image Path: ${avatarLocalPath}`);
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    console.log(`Cover Image Path: ${coverImageLocalPath}`);


    // If no avatar local path is found then an error is thrown
    // if(!avatarLocalPath) throw new apiError(400, "Avatar Missing")
    // if(!coverImageLocalPath) throw new apiError(400, "Cover Image local Path  Missing")
    if(!avatarLocalPath || !coverImageLocalPath){
        console.log("One or more files image files missing!");
        throw new apiError(400, "One or more files image files missing!");
    }
 

    
    // 5. Upload them to cloudinary
    // Avatar and coverImages are uploaded via the paths we receive
    // from multer
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // If avatar is not present then error is thrown since avatar is 
    // a required field
    if(!avatar) throw new apiError(400, "Avatar File is Required");
    if(!coverImage) throw new apiError(400, "Cover Image File is Required");



    // 6. Create user object - create entry in DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email,
        username: username.toLowerCase()
    })



    // 7. Remove password and refresh token field from response
    //Holds the user excluding password and refresh token fields and if
    // userPresent is not found then some server side error occurred
    const userPresent = await User.findById(user._id).select("-password -refreshToken");
    


    // 8. Check for user creation
    if(!userPresent) throw new apiError(500, "Something went wrong while registration.")



    // 9. Return response else return error
    return res.status(201).json(new apiResponse(200, userPresent, "User Registered Successfully"))
})

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        // The user is found using the ID
        const user = await User.findById(userId);

        // Following which the access and refresh tokens are created
        // using the methods that we defined using 
        // User.method... in user.model.js 
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Following the creation of the tokens we set the user's refreshToken to the created refreshToken
        // Additionally, we save it with validateBeforeSave to false
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        // Return the accessToken and refreshToken
        return {accessToken, refreshToken};
    }
    catch(error){

        // Errors are caught and thrown as server side errors
        throw new apiError(500, "Something went wrong while generating tokens");
    }
}

const loginUser = asyncHandler(async (req, res) => {
    // 1. Get data from req.body
    const {username, email, password} = req.body;
    
    // 2. Validate data
    if(!username && !email) throw new apiError(400, "Username or Email is required");

    // 3. Find user
    // You can confirm using username or email whichever the user enters
    // If the user does not enter then an error is thrown.
    const user = await User.findOne({
        $or: [{username}, {email}]
    });
    if(!user) throw new apiError(404, "User not found!");

    // Password check
    // We call the method stored within the user created from User.
    // From the user.model.js 
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new apiError(401, "Password Incorrect!");

    // Access and Refresh tokens are generated
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    // Send cookies
    const loggedUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(
        new apiResponse(200, {
            user: loggedUser, accessToken, refreshToken
        },
        "User logged in successfully!"
        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    // The User is updated through ID while setting using $set: refreshToken to
    // undefined that would mean that the refresh token has been set to undefined
    // Additionally, new is set to true meaning a modified version of the doc
    // is made and updated.
    const user = await User.findByIdAndUpdate(req.user._id, 
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    
    // These will be options used for cookies
    // httpOnly - can only be edited via the server
    // secure - data will only be exchanged only through an HTTP connection
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) throw new apiError(401, "Unauthorized Request!");
    
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
        if(!user) throw new apiError(401, "Invalid refresh Token");
    
        if(incomingRefreshToken !== user?.refreshToken) throw new apiError(401, "Refresh token is expired or used");
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(200, {accessToken, newRefreshToken}, "Access Token refreshed")
        )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Refresh Token");
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect) throw new apiError(400, "invalid Password")
    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const {fullName, email} = req.body;
    if(!username || !email) throw new apiError(400, "All fields are required")

    User.findByIdAndUpdate(req.user?._id,
        {
            $set: {fullName, email}
        },
        {new: true}
    ).select("-password")
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(200, req.user, "Current User fetched successfully!");
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path;

    if(!avatarLocalPath) throw new apiError(400, "Avatar file is missing!");
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url) throw new apiError(400, "Error while uploading on avatar");

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}).select("-password");

        return res
        .status(200)
        .json(new apiResponse(200, user, "Avatar Image Updated!"))
})

const updateUserCover = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath) throw new apiError(400, "cover Image file is missing!");
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url) throw new apiError(400, "Error while uploading on cover image");

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}).select("-password");

        return res
        .status(200)
        .json(new apiResponse(200, user, "Cover Image Updated!"))
})

export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, updateUserDetails};