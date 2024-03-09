// Importing the dotenv and the connectDB()
import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import { app } from './app.js';


// We need to config the dotenv package since as we said in the package.json script that we'd like for the dotenv to load in before the file is actually run to make everything consistent and smooth running
dotenv.config({
    path: './env' // Path has been provided for the .env file
})


// Also, since the connectDB() returns a promise we can .then and .catch it. But before that move on to the next header in README.md i.e. "Setting up the express server part"
// After reading the above, we can now directly use app.js and have it listen on port specified in .env or if nothing given then simply use the alternate that we type in i.e. in this case 8000. If any error then simply catch and log it.
connectDB()
    .then(() => {
        app.listen((process.env.PORT || 8000), () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(`Server connection failed - ${err}`);
    })