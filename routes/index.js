var express = require('express');
var router = express.Router();
var User=require('../models/user');
//var addShip=require('../models/ShipMaster');
var addShip=require('../models/addShip');
var TransportationStatus=require('../models/TransportationStatus');
var mongoose=require('mongoose');
var csurf=require('csurf');
var swal=require('sweetalert');






var bcrypt=require('bcrypt-nodejs');

var Transportation=require('../models/addTransortation');
mongoose.connect('mongodb://localhost:27017/ShipCargo');
var nodemailer=require('nodemailer');
var passport=require('passport');
var csrf=require('csurf');
var csrfprotection=csrf();
router.use(csrfprotection);

const pdfMake=require('pdfmake/build/pdfmake'); 
const pdfFonts=require('pdfmake/build/vfs_fonts');

pdfMake.vfs=pdfFonts.pdfMake.vfs;






var items1;
var Schema=mongoose.Schema;
var citySchema=new Schema({
  Srno:{type:Number},
  cityName:{type:String}
  
},{collection:'city'});



var cityData=mongoose.model('cityData',citySchema);


router.get('/dashboard',isLoggedIn,function(req,res,next){
 

 
  //var smaster=req.shipmaster.userType;
  var name=req.user.CustomerName;
  var id=req.user._id;

 
  console.log(res.locals.login);
  
  req.session.username=name;
  var userState=req.user.userType;
 
  

  if(!req.session.username){
    res.redirect('/Users/signin');
  }
  else
  {
   
 
  if(userState=="1")
  {
   
   
    cityData.find().then(function(docCity){

      Transportation.find({CustomerId:req.user._id}).populate('CustomerId','CustomerName').then(function(docTransportationData){

       
        Transportation.find({CustomerId:id,AllocationStatus:true}).populate('ShipId','ShipName').then(function(getAllocateData){
          getShipId=getAllocateData.map((Transportation)=>{return Transportation.ShipId});

          addShip.find({_id:getShipId}).populate('ShipMasterName','CustomerName').then(function(getShipMastName){

         //  getShipMasterName2=getShipMastName.map((addShip)=>{return addShip.ShipMasterName.CustomerName});

          //  console.log("+++++++++++++++++++++++");
           // console.log(getShipMasterName2);
             //console.log("+++++++++++++++++++++++");
  
           // addShip.find({})
  
              // console.log("+++++++++++++++++++++++");
              // console.log(getAllocateData);
              // console.log("+++++++++++++++++++++++");


              Transportation.find({CustomerId:req.user._id}).populate('CustomerId','CustomerName email').then(function(docstatusdata){

                Transportation.find({CustomerId:req.user._id}).populate('CustomerId ShipId','CustomerName ShipName').then(function(getHistory){

                  res.render('Customers/CustomerDashboard',{username:name,items:docCity,csrfToken:req.csrfToken(),transData:docTransportationData,getAllocationData1:getAllocateData,smdata:getShipMastName,statusdata:docstatusdata,hist:getHistory});
                });

                

                 

              

               


              });
  
  
  
            


          });
          

         

        });
        
        
       
      });
     
    });
   
      
    
  }
  else if(userState=="0"){
    
    
    cityData.find()
  .then(function(doc){
    //var messages=req.flash('error');
     items1=doc;



   

     User.find({userType:"3"})
     .then(function(doc){
      var items2=doc;





      addShip.find().populate('ShipMasterName','CustomerName').then(function(doc3){
          var items3=doc3






          Transportation.find()
  
          .populate('CustomerId','CustomerName email')
         
          .exec().then(function(docTransportation){
            var findTransportationAdmin=docTransportation;
            //console.log(docTransportation);

              Transportation.find({Status:true}).populate('CustomerId','CustomerName email')
              .exec().then(function(docAccepted){
                var findAccepted=docAccepted;

                Transportation.find({Status:false}).populate('CustomerId','CustomerName email')
                .exec().then(function(docRejected){
                  var findRejected=docRejected;



                  User.find({userType:"1"})
                  .then(function(docCustomers){
                    var customersDoc=docCustomers;

                   
                      addShip.find().then(function(docGetShips){

                       User.find({userType:1}).count(function(err,userstotal){

                        User.find({userType:3}).count(function(err,shipmastercount){

                          console.log("uuuuuuuuuuuu");
                          console.log(userstotal);
                          
                          // var start=new Date();
                          // start.setHours(0,0,0,0);
                          // var end=new Date();
                          // end.setHours(23,59,59,999);

                          const now = new Date();
                          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                          Transportation.find({Status:true}).count(function(err,getacc){

                            Transportation.find({Status:false}).count(function(err,getrej){
                              res.render('Admin/AdminDashboard',{csrfToken:req.csrfToken(),username:name,items:items1,users:items2,ships:items3,transportations:findTransportationAdmin,transportationAccepted:findAccepted,transportationRejected:findRejected,Customers:customersDoc,getShipData:docGetShips,totalcust:userstotal,totalsmaster:shipmastercount,getacc:getacc,getrej:getrej});
                            });
                            

                          });

                          

                        });

                         
                        });
                       
                      })  
                      



                       
                    
                  
                    

                    
                  })
                 
         
                });

               
              });

          

            
          });
          
          
      });
     
     
     
     
     });

   });
   
   
  }
else if(userState=="3"){

 addShip.find({ShipMasterName:req.user._id}).then(function(trans1){

  getShipIdd=trans1.map((addShip)=>{return addShip._id});
 // console.log(getShipIdd);

  Transportation.find({ShipId:getShipIdd}).populate('CustomerId ShipId','CustomerName ShipName').then(function(trans2){
   // console.log(trans2);
    User.find({_id:req.user._id}).then(function(docgetuserid){
      getCust=docgetuserid.map((User)=>{return User._id});

      addShip.find({ShipMasterName:getCust}).then(function(docsname4){
        getsname5=docsname4.map((addShip)=>{return addShip._id});
        // console.log("ssssssss");
        // console.log(getsname5);


        TransportationStatus.find({ShipId:getsname5}).then(function(getStatusTransportation){

         
            res.render('ShipMaster/shipmasterdashboard',{csrfToken:req.csrfToken(),username:req.user.CustomerName,transport1:trans2,getStatus1:getStatusTransportation});
          
          

        });


        
      });

    });

 


   
    
  });

 

 });
   
      
  
    
  
}

  }

 
});
/*async function getadmindata(){
  var tem = await cityData.find()
  .then(function(doc){
    //var messages=req.flash('error');
     return Promise.items1=doc;
    // console.log(items1);
     //items1=req.doc;  
   });
   //return items1;
}*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Users/index');
});
router.get('/Users/signin',function(req,res,next){
  var messages=req.flash('error');
  
 
  res.render('Users/signin',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0,swal});
});
router.post('/Users/signin',passport.authenticate('local.signin',{
  
  successRedirect:'/dashboard',
  failureRedirect:'/Users/signin',
  failureFlash:true
}));
var random;
var ceilRandom;
router.get('/Users/forgot',function(req,res,next){
  var checkuser=req.flash('noemail');
  res.render('Users/Forgotpassword',{csrfToken:req.csrfToken(),hasErrors:checkuser.length>0,msgemail:checkuser});
});
let sessionEmail;
router.post('/otp',function(req,res,next){
  User.find({email:req.body.email}).then(function(getEmailResponse){

      console.log("@@@@@@@@@@");
      console.log(getEmailResponse);

      if(getEmailResponse.length){



        sessionEmail=req.session;
        sessionEmail.email=req.body.email; 
       
       
          random=Math.random()*(9999-1000)+1000;
          ceilRandom=Math.ceil(random);
          console.log("RANDOM***");
          console.log(ceilRandom);
      
      
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'kdy20041999@gmail.com',
              pass: 'kdy@2004'
            }
          });
          
         var mailOptions = {
            from: 'kdy20041999@gmail.com',
            to: req.body.email,
            subject: 'Sea Cargo Express',
            text: 'YOUR OTP IS : '+ceilRandom
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              
              console.log('Email sent: ' + info.response);
             
              res.redirect('/checkOTP');
        
            }
          });

      }else{
            req.flash('noemail','No user found!');
            res.redirect('/Users/forgot');
      }
  });
 
});

router.get('/checkOTP',function(req,res,next){
  var messages=req.flash('errors')
  res.render('Users/CheckOTP',{csrfToken:req.csrfToken(),hasErrors:messages.length>0,msg:messages});
});
router.post('/checkOTP',function(req,res,next){
    if(req.body.otp==ceilRandom){
      res.redirect('/resetPassword');
    }
    else{
      //console.log("No");
      req.flash('errors','Invalid OTP!');
      res.redirect('/checkOTP');
    }
  
});

router.get('/resetPassword',function(req,res,next){
  var msgs=req.flash('errors1');
  res.render('Users/ResetPassword',{csrfToken:req.csrfToken(),hasErrors:msgs.length>0,msg1:msgs});
});
router.post('/resetPassword',function(req,res,next){
  var newUser=new User();
  var newPass=req.body.password;
  var reenter=req.body.reenter;

  sessionEmail=req.session;
  let getsessionemail=sessionEmail.email;
  if(newPass==reenter){
    User.findOneAndUpdate({email:getsessionemail},{$set:{password:newUser.encryptPassword(newPass)}},function(err,docReset){

      if(!err){
        
        console.log("Password Updated");
      }
    });
  
    console.log("EMail"+getsessionemail);
    res.redirect('/Users/signin');
  }
  else{
    req.flash('errors1','Passwords are not same');
    res.redirect('/resetPassword');
  }
});
router.get('/Users/signup',function(req,res,next){
cityData.find()
.then(function(doc){
  var messages=req.flash('error');
  
  res.render('Users/signup',{csrfToken:req.csrfToken(),messages:messages,hasErrors:messages.length>0,items:doc});
});
  
});
router.post('/Users/signup',passport.authenticate('local.signup',{
 
  successRedirect:'/Users/signup',
  failureRedirect:'/Users/signup', 
  failureFlash:true
}));
router.get('/adddata',function(req,res,next){
  res.render('partials/addshipmaster');
});
router.get('/ShipMaster/addshipmaster',function(req,res,next){
  res.render('Admin/AdminDashboard/#v-pills-profile',{csrfToken:req.csrfToken()});
});
router.post('/ShipMaster/addshipmaster',function(req,res,next){
  var date = new Date().getDate();
  var month=new Date().getMonth();
  var year=new Date().getFullYear();
  var insertDate=date+'/'+month+'/'+year;
  var newUser=new User();
  var item={
    CustomerName: req.body.name,
    email:req.body.email,
    password:newUser.encryptPassword(req.body.password),
    gender:req.body.gender,
    city:req.body.city,
    Contact:req.body.contact,
    regDate:insertDate,
    userType:"3"

   
  };
  var insertShipMaster=new User(item);
  insertShipMaster.save();
  res.redirect('/dashboard');
});

router.get('/getShipMaster',isLoggedIn,function(req,res,next){
      shipmaster.find().populate('city','srno')
      .exec().then(function(doc){
        res.render('Admin/AdminDashboard',{items:doc});
      });
     
});
router.get('/getShipMasterData',isLoggedIn,function(req,res,next){
    User.find().then(function(doc){
      res.render('partials/addship',{csrfToken:req.csrfToken(),itemShipMaster:doc}); 
    });
});
router.post('/ShipMaster/addShip',function(req,res,next){
 // var newShip=new addShip();
  var itemship={
    ShipName:req.body.ShipName,
    ImoNumber:req.body.imoNumber,
    ShipMasterName:req.body.shipmastername,
    capacity:req.body.capacity

   
  };
  //console.log(itemship);
  var insertShip=new addShip(itemship);
  
  insertShip.save();
  res.redirect('/dashboard');
});
 
router.get('/delete/ShipMaster/:id',function(req,res,next){
  User.findByIdAndRemove(req.params.id).exec();
  res.redirect('/dashboard');
});
router.get('/delete1/Ship/:id1',function(req,res,next){
  console.log(req.params.id1);
  addShip.findByIdAndRemove(req.params.id1).exec();
  res.redirect('/dashboard');
});
let upid; 
/*router.get('/UpdateShip/:id2',function(req,res,next){
  upid:req.params.id2;

  res.render('Admin/AdminDashboard',{csrfToken:req.csrfToken()});
});*/

router.get('/updateShip/:id2',isLoggedIn,function(req,res,next){
  var name=req.user.CustomerName;
 // upid:req.params.id2;
  addShip.findById(req.params.id2).then(function(docs2){

      User.find({userType:"3"}).populate('ShipMasterName','CustomerName').then(function(doccc){
        res.render('Admin/updateShip',{csrfToken:req.csrfToken(),username:name,items3:docs2,smDataa:doccc});
      });
     
         
         
        
       
    


   

  });

  

  
    
  
  
});

router.post('/updateShip',function(req,res,next){
  addShip.findOneAndUpdate({_id:req.body._id},{$set:{ShipName:req.body.ShipName,ImoNumber:req.body.imoNumber,ShipMasterName:req.body.shipmastername,capacity:req.body.capacity}},function(err,docUpdated){
    if(err){
      console.error('No entry found');
    }

    console.log(req.body._id);
  });

  res.redirect('/dashboard');
});

router.get('/update/transportationTrue/:status/:id/:email/:stype/:ncontainer',function(req,res,next){
 
  var id=req.params.id;
  console.log(id);
  console.log(req.params.status);
  console.log(req.params.email);


  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kdy20041999@gmail.com',
      pass: 'kdy@2004'
    }
  });
  
  var mailOptions = {
    from: 'kdy20041999@gmail.com',
    to: req.params.email,
    subject: 'Sea Cargo Express',
    text: ' Your request for transporting Shipment Type:'+req.params.stype+'\n Number Of Containers:'+req.params.ncontainer+' has been accepted'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      //res.render('mailButton');

    }
  });






   Transportation.findOneAndUpdate({_id:id},{$set:{Status:true}}
      ,function(err, doc){
      
      if(err){
          console.error('error, no entry found');
      }
      
      
      res.redirect('/dashboard');
    });


});
router.get('/update/transportationFalse/:status/:id/:email/:stype/:ncontainer',function(req,res,next){
 
  var id=req.params.id;
  console.log(id);
  console.log(req.params.status);
  console.log(req.params.email);
  

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kdy20041999@gmail.com',
      pass: 'kdy@2004'
    }
  });
  
  var mailOptions = {
    from: 'kdy20041999@gmail.com',
    to: req.params.email,
    subject: 'Sea Cargo Express',
    text: 'Your request for transporting Shipment Type:'+req.params.stype+'\n Number Of Containers:'+req.params.ncontainer+' is pending'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      //res.render('mailButton');

    }
  });







  
    Transportation.findOneAndUpdate({_id:id},{$set:{Status:false}}
      ,function(err, doc){
      
      if(err){
          console.error('error, no entry found');
      }
      
      
      res.redirect('/dashboard');
    });
});

/*router.get('/accepted',function(req,res,next){
  User.find({userType:"3"}).then(function(docUsers){
    res.render('partials/AcceptedTransportation',{shipNames:docUsers});
  })
})*/


router.get('/shipAllocation/:id6',function(req,res,next){
    var name=req.user.CustomerName;

    Transportation.findById(req.params.id6).populate('CustomerId','CustomerName').then(function(docAllocation){
        addShip.find().where('capacity').gt(0).then(function(docShips){
          res.render('Admin/shipAllocation',{csrfToken:req.csrfToken(),username:name,allocData:docAllocation,shipallocdoc:docShips});
        });

      
     
    })

    
});



router.post('/shipAllocation',function(req,res,next){
 
  var cap;
  var obj;
  var  custt=req.body.custname;
  
  console.log("======*****");
                console.log(req.body.custname);
                console.log("======*****");
  
  Transportation.find({_id:req.body._id}).then(function(docNumcontainers){
     
      obj=docNumcontainers.map((Transportation)=>{return Transportation.NumberContainer});
     
      addShip.find({_id:req.body.allocationId}).then(function(docCap){
        cap=docCap.map((addShip)=>{return addShip.capacity});

        var result=(cap-0)-(obj-0);
        //console.log(result);
          //console.log(cap);

          if(result>0){


            addShip.findByIdAndUpdate({_id:req.body.allocationId},{$set:{capacity:cap-obj}},function(errMinus,docMinus){
              if(errMinus){
                console.log(errMinus);
              }


              Transportation.findOneAndUpdate({_id:req.body._id},{$set:{ShipId:req.body.allocationId,AllocationStatus:true}},function(err,docUpdated){
                if(err){
                  console.error('No entry found');
                }
                

               User.find({CustomerName:custt}).then(function(docGetName){
                emailUser=docGetName.map((User)=>{return User.email});
                 Transportation.find({_id:req.body._id}).populate('ShipId','ShipName').then(function(getShip){
                  getShipName=getShip.map((Transportation)=>{return Transportation.ShipId.ShipName});
                  console.log(getShipName);
                   addShip.find({ShipName:getShipName}).populate('ShipMasterName','CustomerName Contact').then(function(getShipMaster){
                    getShipMasterName=getShipMaster.map((addShip)=>{return addShip.ShipMasterName.CustomerName});
                    getShipMasterContact=getShipMaster.map((addShip)=>{return addShip.ShipMasterName.Contact});
                    

                 /*  console.log("======*****");
                 
                    console.log(getShipMasterContact);
                    console.log("======*****");*/



                     var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                      user: 'kdy20041999@gmail.com',
                      pass: 'kdy@2004'
                    }
                  });
                  
                  var mailOptions = {
                    from: 'kdy20041999@gmail.com',
                    to: emailUser,
                    subject: 'Sea Cargo Express',
                    text: 'Allocation has been done for your shipment and the data is given below \n'+'\n'+'Shipment Type:'+req.body.stype+'City:'+req.body.city+
                    'ShipMasterName:'+getShipMasterName+'\n'+'ShipName:'+getShipName+'\n'+'FOR ANY QUERIES CONTACT:'+getShipMasterContact
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      //res.render('mailButton');
                
                    }
                  });



                    
                   });


                 
                 });
               
                    







                

               });
                
               // console.log(req.body._id);
              });

              

              

            





              

            
              res.redirect('/dashboard');



            });


          
            
          }
          else{
            console.log("Not enough space");
            res.redirect('/dashboard');
          }
      });

        
    
     


  });

});

router.get('/pdfGenerate/:id7',function(req,res,next){
  //res.send('PDF');

  Transportation.find({_id:req.params.id7}).populate('ShipId CustomerId','ShipName ImoNumber CustomerName').then(function(docgetPDF){


    ShipName1=docgetPDF.map((Transportation)=>{return Transportation.ShipId.ShipName});
    ImoNumber1=docgetPDF.map((Transportation)=>{return Transportation.ShipId.ImoNumber});
    CustomerName1=docgetPDF.map((Transportation)=>{return Transportation.CustomerId.CustomerName});
    NC=docgetPDF.map((Transportation)=>{return Transportation.NumberContainer});
    City1=docgetPDF.map((Transportation)=>{return Transportation.city});
    stype1=docgetPDF.map((Transportation)=>{return Transportation.ShipmentType});

      addShip.find({ShipName:ShipName1}).populate('ShipMasterName','CustomerName').then(function(docsmastpdf){
        shipmasterName1=docsmastpdf.map((addShip)=>{return addShip.ShipMasterName.CustomerName});
        
    var docDefinition={
      pageSize:'A5',
    /* pageSize: {
      width: 595.28,
      height: 'auto'
    },*/
      pageOrientation:'portrait',
      pageMargins: [ 60, 80, 140, 160 ],
     header : {
        columns:[
          {text:'SHIPMENT INFORMATION',alignment:'center',margin:[5,2],fontSize:20}
        ]
     },
  
    
   
      content:[
       
        
       {text:'ShipName : '+ShipName1,bold:true},
       {text:'ShipMaster Name : '+shipmasterName1,bold:true},
        {text:'ImoNumber : '+ImoNumber1,bold:true},
        {text:'CustomerName :'+CustomerName1,bold:true},
        {text:'Number of containers :'+NC,bold:true},
        {text:'Shipment Type :'+stype1,bold:true},
        {text:'City :'+City1,bold:true},
        { qr: 'ShipName : '+ShipName1+'\nShipMaster Name :'+shipmasterName1+'\ImoNumber :'+ImoNumber1+
        '\nCustomer Name'+CustomerName1+'\nContainers :'+NC+'\nShipment Type'+stype1+'\nCity'+City1
        , fit: '100',alignment:'center'},

        
        
        
      ],
     

      
      
    };

    const pdfDoc=pdfMake.createPdf(docDefinition);
    pdfDoc.getBase64((getDataPDF)=>{
      res.writeHead(200,
        {
          'Content-Type':'application/pdf',
          'Content-Disposition':'attachment;filename="ShipmentDetails.pdf"'
        });

        const downloadPDF=Buffer.from(getDataPDF.toString('utf-8'),'base64');
        res.end(downloadPDF);
    });

  });

      });


});


router.post('/UpdateShipMasters',function(req,res,next){
    res.send(req.query._csrf);
});






//=======================CUSTOMERS===========================================



router.get('/Customers/transportationRequest',function(req,res,next){
 
  res.render('partials/AddTransportationRequest',{csrfToken:req.csrfToken()});
  });
  

 
    

router.post('/Customers/transportationRequest',function(req,res,next){
  var date = new Date().getDate();
  var month=new Date().getMonth();
  var year=new Date().getFullYear();
  var insertDate=date+'/'+month+'/'+year;
 var itemTransportation={
    CustomerId:req.user._id,
    NumberContainer:req.body.numcontainer,
    city:req.body.city,
    ShipId:null,
    ShipmentType:req.body.shipmenttype,
    Status:false,
    AllocationStatus:false,
    RequestedOn:insertDate,
    Completed:false,
    StatusTransportation:true,
    CheckStatus:true

    
    
   
  };
  console.log("iiiiiiiiii");
  console.log(itemTransportation);
  var insertTransportationn=new Transportation(itemTransportation);
  
  insertTransportationn.save();
  res.redirect('/dashboard');

  //console.log(req.user._id);
});

router.get('/logout',function(req,res,next){
    req.session.destroy();
    res.redirect('/Users/signin');
});

router.get('/deleteRequest/:idRequest',function(req,res,next){
  console.log(req.params.id);
  Transportation.findByIdAndRemove(req.params.idRequest).exec();
 res.redirect('/dashboard');
});


router.get('/updateTransportationRequest/:updateRequestId',function(req,res,next){
  var name=req.user.CustomerName;
 // upid:req.params.id2;
  Transportation.findById(req.params.updateRequestId).then(function(docsUpdatedTransportation){

      cityData.find().then(function(docCities){




        res.render('Customers/updateTransportation',{csrfToken:req.csrfToken(),username:name,itemsUpdated:docsUpdatedTransportation,cityDataTransportation:docCities});
      });
       
      });

  });

  router.post('/updateTransportationRequest',function(req,res,next){
    Transportation.findOneAndUpdate({_id:req.body._id},{$set:{NumberContainer:req.body.numcontainer,city:req.body.city,ShipmentType:req.body.shipmenttype}},function(err,docsUpdatedTransportation1){
      if(err){
        console.error('No entry found');
      }
  
      console.log(req.body._id);
    });
  
    res.redirect('/dashboard');
  });

  router.get('/getShipMasterData/:shipName',function(req,res,next){
      console.log(req.params.shipName);
      addShip.find({ShipName:req.params.shipName}).populate('ShipMasterName','CustomerName email city Contact').then(function(docShipMasterAllocated){
         res.render('Customers/ViewAllocatedShipMaster',{csrfToken:req.csrfToken(),shipMasterData:docShipMasterAllocated,username:req.user.CustomerName});
      });

  });
  router.get('/profile',isLoggedIn,function(req,res,next){
   
    
    User.find({_id:req.user._id}).then(function(docProfileCustomer){
     // console.log("==========="+docProfileCustomer)
        cityData.find().then(function(getCityProfile){
          //console.log("CCCCCCCCCCC"+getCityProfile);
          
          res.render('Customers/Profile',{csrfToken:req.csrfToken(),username:req.user.CustomerName,profileCust:docProfileCustomer,cityCust:getCityProfile});
          
        });
      
     

    });
  
    
  });
  router.post('/profileUpdateCustomer',function(req,res,next){
    // res.send(req.body._id);

     User.findByIdAndUpdate({_id:req.body._id},{$set:{CustomerName:req.body.custname,email:req.body.email,gender:req.body.gender,city:req.body.city,Contact:req.body.contact}}).then(function(err,updatedShipMasterData){
           if(!err){
             res.redirect('/profile');
           }
     });
     res.redirect('/profile');
 });


  router.post('/changepassword',function(req,res,next){
    var newUser=new User();
      //var oldpassword=newUser.encryptPassword(req.body.old);
     var generatedpassword=bcrypt.hashSync(req.body.new,bcrypt.genSaltSync(5),null);
    // var newhash=req.body.new;


      User.findOne({_id:req.body._id}).then(function(checkPassword){
       

           // res.send(checkPassword);
           
           
           getpassword=checkPassword.password

          bcrypt.compare(req.body.old,getpassword,function(err,res){
            if (err){
              console.log('error');
            }
            if(res){
             
                  var newpassword=req.body.new;
                  var reenter=req.body.again;

                  if(newpassword==reenter){
                   
                    User.findOneAndUpdate({_id:req.body._id},{$set:{password:newUser.encryptPassword(req.body.new)}},function(err,docUpdated){

                      if(!err){
                        
                        console.log("Password Updated");
                      }
                    });



                  }
                  else{
                  
                    console.log("Incorrect Passwords");
                  }
            }
            else{
             
              console.log("NOO");
            }
           
           
          });
      
  });
  res.redirect("/profile");
});


  

  
//++++++++++++++++++++++++++++++++++++++++++++++++++++SHIPMASTER+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router.get('/ShipMasterprofile',isLoggedIn,function(req,res,next){
  User.find({_id:req.user._id}).then(function(docProfileCustomer){
   // console.log("==========="+docProfileCustomer)
      cityData.find().then(function(getCityShipMaster){
        //console.log("CCCCCCCCCCC"+getCityProfile);
        res.render('ShipMaster/ShipMasterProfile',{csrfToken:req.csrfToken(),username:req.user.CustomerName,profileCust:docProfileCustomer,cityshipmst:getCityShipMaster});
      });
   

  });
  
});



router.get('/changeStatus/:getId',function(req,res,next){


  
Transportation.findByIdAndUpdate({_id:req.params.getId},{$set:{StatusTransportation:false,CheckStatus:false}},function(err,updatedStatus1){
  if(err){
    console.error('No entry found');
  }
  console.log(req.body._id);
});

Transportation.find({_id:req.params.getId}).populate('CustomerId','email').then(function(getemailId){
  getCustId=getemailId.map((Transportation)=>{return Transportation.CustomerId.email});
  getShipment=getemailId.map((Transportation)=>{return Transportation.ShipmentType});

  console.log(getCustId);



  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kdy20041999@gmail.com',
      pass: 'kdy@2004'
    }
  });
  
  var mailOptions = {
    from: 'kdy20041999@gmail.com',
    to: getCustId,
    subject: 'Sea Cargo Express',
    text: 'Your shipment '+getShipment+' is out for delivery'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      //res.render('mailButton');

    }
  });




});

res.redirect('/dashboard');

});

router.get('/changeStatus1/:getId',function(req,res,next){

  Transportation.findByIdAndUpdate({_id:req.params.getId},{$set:{Completed:true}},function(err,updatedStatus1){
    if(err){
      console.error('No entry found');
    }
    console.log(req.body._id);
  });
  Transportation.find({_id:req.params.getId}).populate('CustomerId','email').then(function(getemailId){
    getCustId=getemailId.map((Transportation)=>{return Transportation.CustomerId.email});
    getShipment=getemailId.map((Transportation)=>{return Transportation.ShipmentType});
    getcity=getemailId.map((Transportation)=>{return Transportation.city});
  
    console.log(getCustId);
  
  
  
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'kdy20041999@gmail.com',
        pass: 'kdy@2004'
      }
    });
    
    var mailOptions = {
      from: 'kdy20041999@gmail.com',
      to: getCustId,
      subject: 'Sea Cargo Express',
      text: 'Your shipment '+getShipment+' is Reached to the destination '+getcity
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        //res.render('mailButton');
  
      }
    });
  
  
  
  
  });
  
  res.redirect('/dashboard');
  
  });

  router.post('/profileUpdate',function(req,res,next){
     // res.send(req.body._id);

      User.findByIdAndUpdate({_id:req.body._id},{$set:{CustomerName:req.body.custname,email:req.body.email,gender:req.body.gender,city:req.body.city,Contact:req.body.contact}}).then(function(err,updatedShipMasterData){
            if(!err){
              res.redirect('/ShipMasterprofile');
            }
      });
      res.redirect('/ShipMasterprofile');
  });







module.exports = router;



function isLoggedIn(req,res,next){
 // console.log(req.user);
  //console.log(req.user.userType);
  
  
  if(req.isAuthenticated()){
    res.set('Cache-control','no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0');
    return next();
  }
  res.redirect('/Users/signin');
  

}
