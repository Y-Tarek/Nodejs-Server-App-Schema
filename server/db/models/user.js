const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
        
        email:{
            type:String,
            required:true,
            unique:true,
            validate: {
                validator: (val) => {
                return validator.isEmail(val);
                },
                message : '{VALUE} is not a valid email'
            }
        },

        password:{
            type:String,
            required:true,
            trim:true
        },

        tokens:[{
            token:{
                type:String,
                required:true
            },
            access:{
                type:String,
                required:true
            }
        }]
});

//Instance Methods
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id:user._id, access:access}, process.env.JWT_SECRETE);
    user.tokens.push({
        token:token,
        access:access
    });
    return user.save().then(() => {
        return token;
    })
}

UserSchema.methods.removeToken = function(token){
    var user = this;
   return user.updateOne({
        $pull:{
            tokens:{
                token:token
            }
        }
    });
}

//Model Methods
UserSchema.statics.findByCredintials = function(email,pass){
    var user = this;
    return user.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(pass,user.password,(err,res) => {
                if(res){
                  resolve(user);
                }else{
                  reject();
                }
            })
        })
    })
}

UserSchema.statics.findByToken = function(token){
    var user = this;
    var decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRETE);
    }catch(e){
        console.log(e);
        return Promise.reject();
    }
    return user.findOne({
       '_id' : decoded._id,
       'tokens.token' : token,
       'tokens.access' : 'auth'
    });
}


UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
       bcrypt.genSalt(10, (err,salt) => {
           bcrypt.hash(user.password,salt, (err,hash) => {
               user.password = hash;
               next();
           })
       })
    }else{
        next();
    }
})


const User = mongoose.model('Users',UserSchema);
module.exports = {User};