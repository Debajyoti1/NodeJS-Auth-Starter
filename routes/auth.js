const express=require('express')
const router=express.Router()
const AuthController=require('../controllers/AuthController')
const passport=require('passport')

router.get('/login',AuthController.loginPage)
router.get('/register',AuthController.registerPage)
router.get('/forgot',AuthController.forgotPage)

router.get('/google',passport.authenticate('google',{scope: ['profile','email']}))
router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/auth/login'}),AuthController.loginHandle)


router.post('/register', AuthController.registerHandle)

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', AuthController.activateHandle);

//------------ Forgot Password Handle ------------//
router.post('/forgot', AuthController.forgotPassword);

//------------ Reset Password Handle ------------//
router.get('/reset/:id', AuthController.resetPage);
router.post('/reset/:id', AuthController.resetPassword);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', AuthController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login', passport.authenticate(
    'local',
    {failureRedirect: '/auth/login'}
) ,AuthController.loginHandle);

//------------ Logout GET Handle ------------//
router.get('/logout', AuthController.logoutHandle);


module.exports=router