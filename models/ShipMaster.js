var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var Schema=mongoose.Schema;

var ShipMasterSchema=new Schema({
    name:{type:String,required:true},
    contact:{type:Number,required:true},
    city:{type:String},
    email:{type:String,required:true},
    password:{type:String,required:true},
    gender:{type:String},
    regDate:{type:String},
    userType:{type:Number}
});
ShipMasterSchema.methods.encryptPassword=function(password)
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};

ShipMasterSchema.methods.validPassword=function(password)
{
    return bcrypt.compareSync(password,this.password);
};

module.exports=mongoose.model('shipmaster',ShipMasterSchema);
