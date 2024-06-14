const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/students';

mongoose.connect(uri,).then(()=>{
    console.log("connection successfull")
}).catch((error)=>{
    console.log("no connection ",error)   
});

