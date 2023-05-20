// Require the express module and create a new router object
const express=require('express')
const router=express.Router()

//Any request coming to "/" will be handled by home.js router 
router.use('/',require('./home'))

router.use('/auth',require('./auth'))



module.exports=router