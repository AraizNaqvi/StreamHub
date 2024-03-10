// Basic cloudinary and file system import
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


// We configure the cloudinary with the keys it provides by itself
// However, we first store it in the .env to be used secretly without
// sharing any info.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// This is the method that receives the local path and awaits if found
// then using the uploader.upload uploads the local path of any resource
// type and returns response. However, if local path seems to be absent
// then null is returned without uploading anything.
const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log(`File has been uploaded successfully: ${response.url}`);

        return response;
    }

    // If any exception is caught then we unlinksync i.e. delete the
    // the link i.e. local path through which file was uploaded in
    // the first place.
    catch(error){
        fs.unlinkSync(localFilePath);
    }
}