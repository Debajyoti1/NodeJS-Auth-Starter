const passport = require('passport')
const googleStrategy = require('passport-google-oauth20').Strategy
const crypto = require('crypto')
const User = require('../models/user')

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: 'http://localhost:8000/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            const existingUser = await User.findOne({ email: profile.emails[0].value })

            if (existingUser) {
                return done(null, existingUser)
            }
            else {
                const newUser= await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                return done(null,newUser)
            }
        } catch (err) {
            return done(err,null)
        }
    })
)

module.exports=passport