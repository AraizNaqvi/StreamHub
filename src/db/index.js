// importing the mongoose and name that we assigned for the database in the constants file
import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';


// Remembering Hitesh sirs lines of the db might be in some continent hence we need to await its response hence always use async then connect with the database via mongoose.connect().
// within which we pass the link that is confidential as it holds your passkey and also includes the name that we are to give the database
// Also do the following in a try and catch so that we specifically write errors for each call and understand the source of errors.
const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongodDB Connected at HOST: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MongoDB DB Connection Error", error);
        process.exit(1)
    }
}

// Then simply export the above function
export default connectDB;