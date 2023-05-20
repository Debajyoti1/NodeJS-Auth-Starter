const express=require('express')
const router=express.Router()
const HomeController=require('../controllers/homeController')
const AuthController=require('../controllers/AuthController')
const passport=require('passport')

router.get('/',HomeController.homePage)
router.get('/dashboard',passport.checkAuthentication,AuthController.dashboardPage)
module.exports=router