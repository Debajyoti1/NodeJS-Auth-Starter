const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');

const User = require('../models/user')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req,email, password, done) => {
    try {

        const existingUser = await User.findOne({ email: email })
        console.log('checking');
        if (!existingUser) {
            req.flash('error','Invalid credentials')
            return done(null, false)
        }
        bcrypt.compare(password, existingUser.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                req.flash('success','Login Success')
                return done(null, existingUser);
            } else {
                req.flash('error','Invalid credentials')
                return done(null, false, { message: 'Password incorrect! Please try again.' });
            }
        })
    }
    catch (err) {
        console.log(err);
        req.flash('error','Invalid credentials')
        done(err)
    }
}
))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const existingUser = await User.findById(id)
        // console.log(existingUser);
        return done(null,existingUser)
    }
    catch (err) {
        return done(err)
    }
})

passport.checkAuthentication=(req,res,next)=>{
    console.log('checked auth');
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/auth/login')
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){
        console.log('set auth user');
        res.locals.user=req.user
    }
    return next()
}

module.exports=passport