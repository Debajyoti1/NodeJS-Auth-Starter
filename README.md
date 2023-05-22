# NodeJS-Auth-Starter Features
A complete NodeJS + Express + PassportJS + JWT authentication app:

# Tech stack
- express: it is managing the frontend of this App
- Node: takes care of all the backend actions taking place.
- MongoDB: Managing all the data of this App.

## Technologies Used
1.  NodeJS
2.  Express
3.  EJS
4.  MongoDB
5.  Mongoose
6.  PassportJS
7.  JWT
8.  Nodemailer

## Prerequisites
- Git
- NodeJS

## Folder Structure

`assets<br>
   |-- images<br>
   |   |-- login-icon.png<br>
configs<br>
   |-- mail.js<br>
   |-- middleware.js<br>
   |-- mongoose.js<br>
   |-- passport-google-oauth2-strategy.js<br>
   |-- passport-local-strategy.js<br>
controllers<br>
   |-- authController.js<br>
   |-- homeController.js<br>
env<br>
index.js<br>
models<br>
   |-- user.js<br>
package-lock.json<br>
package.json<br>
routes<br>
   |-- auth.js<br>
   |-- home.js<br>
   |-- index.js<br>
views<br>
   |-- _footer.ejs<br>
   |-- _header.ejs<br>
   |-- dashboard.ejs<br>
   |-- forgot.ejs<br>
   |-- home.ejs<br>
   |-- layout.ejs<br>
   |-- login.ejs<br>
   |-- messages.ejs<br>
   |-- register.ejs<br>
   |-- reset.ejs<br>
`

##### Into the project directory

`cd nodeJS-Auth-Starter`

##### Installing NPM dependencies

`npm install`

##### Configuring environment variables with .env file

As we used dot env configuration, please open the env file , add related data and save it as .env

##### Then simply start your app

`npm start`

#### The Server should now be running at http://localhost:8000/
