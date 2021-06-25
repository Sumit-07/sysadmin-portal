require("dotenv").config();
const models=require("../models");
//const bcrypt=require("bcryptjs");
const validator=require("../helpers/validator");
const { Op } = require("sequelize");
const { isExist } = require("../helpers/validator");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
class authController{

    static signup (req,res){
        const {first_name,last_name,country_code,phone_number,email,password} =req.body;
        if(validator.isNotExist(first_name) || validator.isNotExist(last_name) || validator.isNotExist(country_code)
        || validator.isNotExist(phone_number)|| validator.isNotExist(email) || validator.isNotExist(password)){
            return res.status(401).json({
                message: "Please enter all the details"
            });
        }
        //Add a password validator*(length and characters)
        //Checking duplicate phone number or email id
        models.sysadmin.findAll({
            where:{
                [Op.or]: [
                    { email: email },
                    { phone_number: phone_number }
                  ]
            }
        }).then(async result =>{
            if(result.length>0){
                return res.status(401).json({
                    message:"Email-id/phone number already registered"
                })
            }else{
                 //Insert into sys admin db
                    let hashedPassword=await md5(password);
                    const admin={
                        first_name:first_name,
                        last_name:last_name,
                        country_code:country_code,
                        phone_number:phone_number,
                        email:email,
                        password:hashedPassword,
                    };

                    models.sysadmin.create(admin).then(result =>{
                        console.log("Id of the entry is : "+result.id);
                       //Creating token
                        const token = jwt.sign({
                            id:result.id,
                            email:admin.email,
                            phone_number:admin.phone_number,
                            country_code:admin.country_code,
                            first_name:admin.first_name,
                            last_name:admin.last_name,
                        },process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES})

                        return res.status(201).json({token: token})
                    }).catch(error => {
                        return res.status(500).json({
                            message:"Failed to insert admin into the database. Please contact the respective adminitrator!",
                            error:error.message
                        });
                    });

            }
        }).catch(err => {
           return console.log(err);
        })

        
    }

    static async login(req,res){
        const{email,password}=req.body;
        if(validator.isNotExist(email) || validator.isNotExist(password)){
            return res.status(400).json({
                message:"Email id or password can't be empty"
            })
        }

        //Extract the email id and password
       const admin = await models.sysadmin.findOne({
            where:{
                email:email,
                password:md5(password)
            }
        })

        if(validator.isNotExist(admin)){
            return res.status(409).json({
                message : "Invalid email id or password!!"
            });
        }
        const now=new Date();

        //updating login time
        models.sysadmin.update(
            {last_login_at:now},
            {where:{id:admin.id}}
        ).then(result =>{
            console.log("Login time updated");
        }).catch(error=>{
            console.log("Error occured while updating the login time");
        })


        console.log(admin);
        //Creating token
        const token = jwt.sign({
            id:admin.id,
            email:admin.email,
            phone_number:admin.phone_number,
            country_code:admin.country_code,
            first_name:admin.first_name,
            last_name:admin.last_name,
        },process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES})

        console.log("The jwt token is : "+token);
        
        const cookieOptions={
            expires : new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES),
            httpOnly : true
        };

       // res.cookie('jwt',token,cookieOptions);

        //Create activity log
        const action=admin.first_name+" "+admin.last_name+" logged in the app successfully";
        const activityLog={
            action_type:"Login",
            action:action,
            username:admin.first_name+" "+admin.last_name

        };
        models.sys_admin_activity_logs.create(activityLog).then(result=>{
            console.log("Activity log created!!")
        }).catch(error=>{
            console.log("Failed to create activity log "+error.message);
        })
        
        return res.status(200).json({
            token:token
        })
    
    }

    static async logout(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.send(409).json({
                message:"Invalid request"
            })
        }
        const adminId=req.auth.id;

        //update the logout  time
        const now=new Date(Date.now());
        models.sysadmin.update({
            last_logout_at : now
        },{where : { id : adminId }});

         //Create activity log
         const action= req.auth.first_name+" " + req.auth.last_name+" logged out of the app successfully";
         const activityLog={
             action_type : "Logout",
             action : action,
             username : req.auth.first_name + " " + req.auth.last_name
 
         };
         models.sys_admin_activity_logs.create(activityLog).then(result=>{
             console.log("Activity log created!!")
         }).catch(error=>{
             console.log("Failed to create activity log "+error.message);
         })
         return res.status(200).json({
             message:"Logged out successfully!!"
         })
    }

    static async alreadyLoggedIn(req,res){

        console.log(req.auth);
        if(!validator.isLoggedIn(req.auth)){
            return res.status(409).json({
                message:"Invalid request"
            })
        }
        const admin = req.auth;

        

        const now=new Date();

        //updating login time
        await models.sysadmin.update(
            {last_login_at:now},
            {where:{id:admin.id}}
        ).then(result =>{
            console.log("Login time updated");
        }).catch(error=>{
            console.log("Error occured while updating the login time");
        })

        //Create activity log
        const action=admin.first_name+" "+admin.last_name+" logged in the app successfully";
        const activityLog={
            action_type:"Login",
            action:action,
            username:admin.first_name+" "+admin.last_name

        };
        await models.sys_admin_activity_logs.create(activityLog).then(result=>{
            console.log("Activity log created!!")
        }).catch(error=>{
            console.log("Failed to create activity log "+error.message);
        })


        return res.status(200).json(admin);

    }
} module.exports=authController;