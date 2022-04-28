var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var city=require('../models/city');
var User=require('../models/user');
var Schema=mongoose.Schema;

var ShipSchema=new Schema({

    ShipName:{type:String,required:true},
    ImoNumber:{type:String,required:true},
    ShipMasterName:{type:Schema.Types.ObjectId,ref:'User'},
    capacity:{type:Number,required:true},
   

});


module.exports=mongoose.model('addShip',ShipSchema);

