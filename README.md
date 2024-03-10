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