// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express'); // Web framework for Node.js
const mongoose = require('./configs/mongoose'); // MongoDB config file is called to initiate DB connection
const expressLayouts=require('express-ejs-layouts')
const cookieParser=require('cookie-parser')
const session=require('express-session')
const passport=require('passport')
const passportLocal=require('./configs/passport-local-strategy')
// const passportJWT=require('./configs/passport-jwt-strategy')
const MongoStore=require('connect-mongo')
const flash=require('connect-flash')
const customMiddleware=require('./configs/middleware')
const passportGoogle = require('./configs/passport-google-oauth2-strategy')

// Create an instance of the Express application
const app = express();
app.use(expressLayouts)
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)

// Use middleware to parse incoming requests
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cookieParser())
app.use(session({
  name: 'NodeAuth',
  secret: process.env.SECRET || 'sample-secret123',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000*3660*24 //24 hours
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGOOSE_URI,
    autoremove: 'enabled',
    ttl: 14 * 24 * 60 * 60
  })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(passport.setAuthenticatedUser)
app.use(flash())
app.use(customMiddleware.setFlash)

// Serve static files from the 'assets' directory
app.use(express.static('./assets'))

// Set the view engine to 'ejs' and specify the directory for views
app.set('view engine', 'ejs');
app.set('views', './views');

// Import and use routes defined in separate modules
app.use('/', require('./routes'));

// Start the server
const port = process.env.PORT || 8000; // Use the port defined in the environment variable, or default to port 8000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});