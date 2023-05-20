const mongoose = require('mongoose')

const MONGOOSE_URI=process.env.MONGOOSE_URI || 'mongodb://localhost:27017/todo_app'

mongoose.connect(MONGOOSE_URI)

const db=mongoose.connection

db.on('error',console.error.bind(console,'error connecting to db'))

db.once('open',()=>{
    console.log('Successfully connected to db');
})
