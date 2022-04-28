var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var city=require('../models/city');
var Schema=mongoose.Schema;

var userSchema=new Schema({
    CustomerName:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    gender:{type:String},
    city:{type:String,required:true},
    Contact:{type:Number,required:true},
    regDate:{type:String},
    userType:{type:Number}

});

userSchema.methods.encryptPassword=function(password)
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

userSchema.methods.validPassword=function(password)
{
    return bcrypt.compareSync(password,this.password);
};





module.exports=mongoose.model('User',userSchema);

