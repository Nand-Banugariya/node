const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    subject: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    //     validate: {
    //         validator: function (v) {
    //             return v === this.password;
    //         },
    //         message: 'Passwords do not match!'
    //     }
    // }
},
tokens:[{
    token:{
        type:String,
        required:true
    }
}]
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
       const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
       this.tokens = this.tokens.concat({token})
       await this.save()
    }catch(error){
     res.status(400).send("error"+ error)
    }
}

employeeSchema.pre('save',async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmPassword = await bcrypt.hash(this.confirmPassword,10)
    }
    next();
})



const Register = mongoose.model('Register', employeeSchema);

module.exports = Register;
