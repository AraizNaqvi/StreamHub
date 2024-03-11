// Importing the express and using app through express()
import express from 'express';
const app = express();


import cors from 'cors';
import cookieParser from 'cookie-parser';
import {LIMIT_SIZE} from './constants.js';


// Cross Origin Resource Sharing
// CORS is like the parent that gives permission given to the website to send/receive data to/from another website for security reasons and takes an object.
app.use(cors({
    origin: process.env.CORS_ORIGIN, // which origins are allowed to access data from this server
    credentials: true, // whether the browser must include the cookies or HTTPS auth while requesting data
    optionsSuccessStatus: 200 // what code to display in the case where a successful request has been made
}))
app.use(express.json({limit: LIMIT_SIZE}))
//Any JSON that is received has to be of a limited size in this case 16kb at max
app.use(express.urlencoded({extended: true, limit: LIMIT_SIZE})) 
// Pre-requisite to using req.body and req.params like functionality since in the url there's a lot of different separators used hence to let nodeJS know that we use this middleware
app.use(express.static('public'))
// When express needs to serve static files like images, fonts, etc it'll refer to the public directory
app.use(cookieParser())
// Serves, receives and checks all cookies and is only accessed by the server


// Import the user-route which we will use in our middleware after a call to a certain prefix has been made
import userRouter from './routes/user.routes.js';
app.use('/api/v1//users', userRouter) // Prefix Route - /api/v1/users and passed on to userRouter


//Exporting the app
export { app };