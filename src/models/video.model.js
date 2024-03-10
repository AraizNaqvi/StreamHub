import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, // Cloudinary url
        required: [true, "Video needed"]
    },
    thumbNail: {
        type: String, // Cloudinary url
        required: [true, "Thumbnail needed"]
    },
    title: {
        type: String,
        required: [true, "Title needed"]
    },
    description: {
        type: String,
        required: [true, "Description needed"]
    },
    duration: {
        type: Number, //Cloudinary url
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);