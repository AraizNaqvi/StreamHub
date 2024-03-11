import {asyncHandler} from '../utils/asyncHandler.utils.js';

const registerUser = asyncHandler(async (req, res) => {
    res.status(500).json({
        message: "Araiz Naqvi here!"
    })
})

export {registerUser};