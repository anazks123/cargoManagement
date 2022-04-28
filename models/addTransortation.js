var mongoose=require('mongoose');
var bcrypt=require('bcrypt-nodejs');
var city=require('../models/city');
var User=require('../models/user');
var addShip=require('../models/addShip');
var Schema=mongoose.Schema;

var TransportationSchema=new Schema({
    

    CustomerId:{type:Schema.Types.ObjectId,ref:'User'},
    NumberContainer:{type:Number,required:true},
    city:{type:String,required:true},
    ShipId:{type:Schema.Types.ObjectId,ref:'addShip',default:null},
    ShipmentType:{type:String,required:true},
    Status:{type:Boolean},
    AllocationStatus:{type:Boolean},
    RequestedOn:{type:String},
    StatusTransportation:{type:Boolean},
    Completed:{type:Boolean},
    CheckStatus:{type:Boolean}
   

   



});







module.exports=mongoose.model('Transportation',TransportationSchema);

