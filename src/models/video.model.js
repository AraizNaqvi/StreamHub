import mongoose from "mongoose";
// mongooseAggregatePaginate helps in better aggregation and pagination
// Aggregation means better functionality over editing, moving, etc
// Pagination is used when working with large datasets wherein we can show a limited number of content on a page at a certain time
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Video model has been defined here
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


// The plugin of mongooseAggregatePaginate has been assigned to videoSchema since a lot of data will be held in this model
// in order to streamline by using aggregation pipelines.
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);