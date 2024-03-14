# StreamHub
StreamHub is a video streaming app where users can learn.<br>
Moving on visit my github repo at:
[streamhub](https://github.com/AraizNaqvi/StreamHub)
<br><br>

# First Steps
I created all the essential folders and files which includes:
- public (Folder)
- src (Folder)
- .env
- package.json
- README.md
- .gitignore

We also install npm packages like express, mongoose, dotenv and prettier.<br>
Also know that while working on previous projects i'd already installed nodemon globally hence did not need to npm install it.
<br><br>

# Solving the dotenv issue with import and require
Simply went over to the package.json and made changes.
- **"type": "module"** -> Means that nodeJS should treat the JS file as ES6 type and hence enabling the use of import and export keys.
- **"--experimental-json-modules"** -> is what allows nodeJS to use the JS file as a module in ES6 format.
- **"nodemon -r dotenv/config --experimental-json-modules src/index.js"** -> Tells nodeJS nodemon that prior to running index.js file preload the dotenv config
<br><br>

We also need to specify some constraints to prettier using **.prettierignore and .prettierrc**

# Connecting the Database
Next, we connect the database in our case is mongoDB.<br>
This is done via copying the mongoDB link also do remember your password and store it in the .env.<br>
Next, we go to  **src > db > index.js**  <br>(Read through comments to understand further).
<br><br>

# Bringing the Database to Life
Here, we go to the **src > index.js** which is the heart of our project.<br>
Here, we call the **src > db > index.js** for the **connectDB()** <br>(Read through the comments to understand further).
<br><br>

# Setting up the Express Server
We move to the **src > app.js** and here we simply create the **app** and export it. From here it is caught by the **src > index.js** which will now use it to run the server on the port mentioned in the .env.
<br>(Read through the comments to understand further).
<br><br>

# Adding some basic middlewares
We move to the **src > app.js** and use the **app.use()** to make them.
<br>(Read through the comments to understand further).
<br><br>

# Adding Utilities
These utilities have not been used just yet but are just set up as preparation for future API uses and assessments.
<br>(Read through the comments to understand further).
<br><br>

# Adding User and Video Models
Now, we start to add models and we've done so in **src > models > user.model.js & video.model.js**
<br>(Read through the comments to understand further).
<br><br>

# Finalizing setup with file upload features
We get some credentials from cloudinary like the cloud name, API key and secret which we store in the .env. Then we start creating a method for cloudinary in **src > utils > cloudinary.utils.js** where we upload the local path for the file type and return the response.<br>
Moving on before the file is uploaded to cloudinary, we will add a middleware using multer to save it on our disk for a brief moment to run some tests and error handle if needed.
<br>(Read through the comments to understand further).
<br><br>

# Setting Routes
Firstly, i've made a sample registerUser in **src > controllers > user.controller.js** with status code and message so that I can test my route handlers.<br>
Next, created a **src > routes > user.routes.js** in which i've exported the user route adding a route that handles the suffix part of the route.<br>
The prefix part is placed in the **app.js** where the user route is first imported and then a middleware is set upon it.
<br>(Read through the comments to understand further).
<br><br>

# Creating the Registration
Head over to **src > controllers > user.controllers.js**
This involves the following steps:<br>
1. Getting Users Info from Frontend
2. Validating Input Data
3. check if user already exists - username, email
4. Check for images, check for avatar
5. Upload them to cloudinary
6. Create user object - create entry in DB
7. Remove password and refresh token field from response
8. Check for user creation
9. Return response else return error
<br>(Read through the comments to understand further).
<br><br>

# Solving Bugs
The following bugs came up while uploading:
1. Missed 'await' keyword usage
2. Postman content-type auto usage was missed.
3. Postman VS Code had some error or idk if it does not provide the same functionality as The Postman Software.
<br>(Read through the comments to understand further).
<br><br>

# Creating the Registration
Head over to **src > controllers > user.controllers.js**
This involves the following steps:<br>
1. Get data from req.body
2. Validate data
3. Find User
4. Validate Password
5. Generate Access and Refresh Tokens
6. Send cookies
