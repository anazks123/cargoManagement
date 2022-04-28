var mongoose=require('mongoose');

var addShip=require('../models/addShip');
var Transportation=require('../models/addTransortation')
var Schema=mongoose.Schema;

var TransportationStatusSchema=new Schema({
    
    

    ShipId:{type:Schema.Types.ObjectId,ref:'addShip'},
    TransportationId:{type:Schema.Types.ObjectId,ref:'Transportation'},
    Status1:{type:Boolean},
    Status2:{type:Boolean},
    Status3:{type:Boolean},
    

   



});







module.exports=mongoose.model('TransportationStatus',TransportationStatusSchema);

