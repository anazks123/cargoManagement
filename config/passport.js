var passport=require('passport');
var User=require('../models/user');
var ShipMaster=require('../models/ShipMaster');
var LocalStrategy=require('passport-local').Strategy;


passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
passport.use('local.signup',new LocalStrategy({
   
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
    var errors=req.validationErrors();
    if(errors)
    {
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }
    User.findOne({'email':email},function(err,user){
        if(err)
        {
            return done(err);
        }
        if(user){
           return done(null,false,{message:'Email is already in use.'});
        }
        var newUser=new User();
        var date = new Date().getDate();
        var month=new Date().getMonth();
        var year=new Date().getFullYear();
        var insertDate=date+'/'+month+'/'+year;
        newUser.CustomerName=req.body.name;
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        newUser.gender=req.body.gender; //  req.body.Name of the textbox
        newUser.city=req.body.city;
        newUser.Contact=req.body.contact;
        newUser.regDate=insertDate;
        newUser.userType=1;
        newUser.save(function(err,result){
                if(err){
                    return done(err);
                }
                return done(null,newUser);
                
        });
    });
}));
/*passport.use('local.shipmastersignup',new LocalStrategy({
   
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
    var errors=req.validationErrors();
    if(errors)
    {
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }
    User.findOne({'email':email},function(err,user){
        if(err)
        {
            return done(err);
        }
        if(user){
           return done(null,false,{message:'Email is already in use.'});
        }
        var newShipMaster=new ShipMaster();
        newShipMaster.name=req.body.name;
        newShipMaster.contact=req.body.contact;
        newShipMaster.city=req.body.city;
        newShipMaster.email=req.body.email;
        newShipMaster.password=newShipMaster.encryptPassword(password);
        newShipMaster.gender=req.body.gender; //  req.body.Name of the textbox
        newShipMaster.regDate=new Date();
        newShipMaster.userType=3;
        newShipMaster.save(function(err,result){
                if(err){
                    return done(err);
                }
                return done(null,newShipMaster);
                
        });
    });
}));
*/
passport.use('local.signin',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    req.checkBody('email','Invalid Email').notEmpty();
    req.checkBody('password','Invalid Password').notEmpty();
    var errors=req.validationErrors();
    if(errors)
    {
        var messages=[];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null,false,req.flash('error',messages));
    }

    User.findOne({'email':email},function(err,user,req,res){
        if(err)
        {
            return done(err);
        }
       
        
        if(!user){
           
           return done(null,false,{message:'No user found!'});
        }
       if(!user.validPassword(password)){
            return done(null,false,{message:'Wrong Password'});
        }
        return done(null,user);
    
    });
    
    
}));  

  