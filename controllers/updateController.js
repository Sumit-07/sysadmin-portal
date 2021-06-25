const models = require("../models");
const validator = require("../helpers/validator");
const constants = require("../helpers/constants");

class updateController{

    static async getUser(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(409).json({
                message: "Please login as system admin to avial this feature"  //redirect it to login page
            })
        }

        var condition={};
        if(req.body.existing_role!='F'){
        //Name, email and existing/old role field are compulsory  (req.body.name, rq.body.email, req.body.existing_role)
        if(validator.isNotExist(req.body.email) || validator.isNotExist(req.body.name)
        || validator.isNotExist(req.body.existing_role)){
            return res.status(400).json({
                message: "Please enter all the necessary fields (marked with *)"
            })
        }

        condition.email = req.body.email;
        condition.role = req.body.existing_role;
        }
        else{
            if(validator.isNotExist(req.body.country_code) || validator.isNotExist(req.body.name)
            || validator.isNotExist(req.body.existing_role) || validator.isNotExist(req.body.phone_number) ){
                return res.status(400).json({
                    message: "Please enter all the necessary fields (marked with *)"
                })
            }

            condition.country_code = req.body.country_code;
            condition.phone_number = req.body.phone_number;
            condition.role = req.body.existing_role;
        }

        await models.users.findOne({
            where: condition,
            attributes: { exclude: ['password'] }
        }).then(result => {
            if(validator.isExist(result)){
                return res.status(200).json(result);
            } else {
                return res.status(404).json({
                    message : "User not found"
                })
            }
        }).catch(err =>{
            return res.status(401).json({
                message : "Unable to retrieve user from the database"
            })
        })
    }

    static async updateCMSuser(req,res){   // A CMS user include a cashier, manager and corporate manager(using the webapp)
        if(!validator.isLoggedIn(req.auth)){
            return res.status(409).json({
                message: "Please login as system admin to avial this feature"  //redirect it to login page
            })
        }
        //Name, email and existing/old role field are compulsory  (req.body.name, rq.body.email, req.body.existing_role)
        if(validator.isNotExist(req.body.email) || validator.isNotExist(req.body.name)
        || validator.isNotExist(req.body.existing_role)){
            return res.status(400).json({
                message: "Please enter all the necessary fields (marked with *)"
            })
        }
       const email = req.body.email;
       const id= await models.users.findOne({
            where:{
                email:email
            }, attributes:['id']
        }).then(result =>{
            if(!result || result===undefined){
                return res.status(404).json({
                    message: "User not found!!"
                })
            } else{
                return result.id;
            }
        }).catch(error =>{
            return res.status(400).json({
                message: "Unable to find user at this moment, please try again later",
                error:error.message
            })
        })
        console.log("Id is "+id);
        const admin=req.auth;
        const user=req.body;

        var updatedUser={updatedBy: admin.first_name+" "+admin.last_name}
        if(user.new_email){
             //Sanity check on new phone number and country code
             models.users.findAll({
                where:{
                    email:user.new_email
                }
            }).then(result=>{
                if(result.length>0){
                    return res.status(500).json({
                        message:"Email id already registered!"
                    })
                } else {
                    updatedUser.email=user.new_email;
                }}).catch(error=>{
                    return res.status(409).json({
                        message: "Unable to update the user",
                        error:error.message
                    })
                })
        }
        constants.UserPublicAttributes.forEach(att=>{
            if(user[att]!==""){
                updatedUser[att]=user[att];
            }
        });
        if(validator.isExist(req.body.new_phone_number)){
        updatedUser.phone_number = req.body.new_phone_number;}
        if(validator.isExist(req.body.new_country_code)){
        updatedUser.country_code = req.body.new_country_code;}

        if(user.existing_role=='A' && (user.role=='M' || user.role=='C')){
            updatedUser.client_code=0;
            updatedUser.agent_id=0;
        }
        console.log("Updated user is "+JSON.stringify(updatedUser));
        await models.users.update(updatedUser,{where:{
            id:id
        }}).then(result =>{
             //Create activity log

             const action=admin.first_name+" "+admin.last_name
             +" updated personal information of the user with id : "+id+ "in the app successfully";
             const activityLog={
                 action_type:"Updated the user : "+user.name,
                 action:action,
                 username:admin.first_name+" "+admin.last_name

             };
             models.sys_admin_activity_logs.create(activityLog).then(result=>{
                 console.log("Activity log created!!")
             }).catch(error=>{
                 console.log("Failed to create activity log "+error.message);
             })
             return res.status(200).json({
                 message: "User updated successfully!!"
             })

        }).catch(error => {
            return res.status(400).json({
                message: "Unable to update the user fields",
                error: error.message
            })
        })
    }

    static async updateCS(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(409).json({
                message: "Please login as system admin to avial this feature"  //redirect it to login page
            })
        }
        //Name, email and existing/old role field are compulsory  (req.body.name, rq.body.email, req.body.existing_role)
        if(validator.isNotExist(req.body.country_code) || validator.isNotExist(req.body.name)
        || validator.isNotExist(req.body.existing_role) || validator.isNotExist(req.body.phone_number) ){
            return res.status(400).json({
                message: "Please enter all the necessary fields (marked with *)"
            })
        }
       
       const id= await models.users.findOne({
            where:{
                country_code: req.body.country_code,
                phone_number: req.body.phone_number
            }, attributes:['id']
        }).then(result =>{
            if(!result || result===undefined){
                return res.status(404).json({
                    message: "User not found!!"
                })
            } else{
                return result.id;
            }
        }).catch(error =>{
            return res.status(400).json({
                message: "Unable to find user at this moment, please try again later",
                error:error.message
            })
        })
        console.log("Id is "+id);
        const admin=req.auth;
        const user=req.body;

        var updatedUser={updatedBy: admin.first_name+" "+admin.last_name}
        
        //Taking all values that needs to be updated
        constants.FieldAgentPublicAttributes.forEach(att=>{
            if(user[att]!==""){
                updatedUser[att]=user[att];
            }
        });
        //Handling the updated manager (take the manager email as input)
        if(validator.isExist(user.manager_email)){
            const manager_id = await models.users.findOne({
                where:{
                    email:user.manager_email
                }, attributes:['id']
            }).then(result =>{
                if(!result || result===undefined){
                    return res.status(404).json({
                        message: "Manager not not found!!"
                    })
                } else{
                    return result.id;
                }
            }).catch(error =>{
                return res.status(400).json({
                    message: "Unable to update at this moment, please try again later",
                    error:error.message
                })
            })
            updatedUser.manager_id = manager_id;

        }

        //handling the change of roles
        if(user.existing_role=='F' && (user.role=='M' || user.role=='C')){
            updatedUser.client_code=0;
            updatedUser.agent_id=0;
        }

        //updating contact details
        if(validator.isExist(user.new_phone_number) && validator.isExist(user.new_country_code)){
            

            //Sanity check on new phone number and country code
            models.users.findAll({
                where:{
                    phone_number:user.new_phone_number,
                    country_code:user.new_country_code
                }
            }).then(result=>{
                if(result.length>0){
                    return res.status(500).json({
                        message:"Phone number already registered!"
                    })
                } else {
                    updatedUser.phone_number=user.new_phone_number;
                    updatedUser.country_code=user.new_country_code;
                }}).catch(error=>{
                    return res.status(409).json({
                        message: "Unable to update the user",
                        error:error.message
                    })
                })
        }
        
        console.log("Updated user data : "+JSON.stringify(updatedUser));
        await models.users.update(updatedUser,{where:{
            id:id
        }}).then(result =>{
             //Creating activity log

             const action=admin.first_name+" "+admin.last_name
             +" updated personal information of the user with id : "+id+ "in the app successfully";
             const activityLog={
                 action_type:"Updated the user : "+user.name,
                 action:action,
                 username:admin.first_name+" "+admin.last_name

             };
             models.sys_admin_activity_logs.create(activityLog).then(result=>{
                 console.log("Activity log created!!")
             }).catch(error=>{
                 console.log("Failed to create activity log "+error.message);
             })
             return res.status(200).json({
                 message: "User updated successfully!!"
             })

        }).catch(error => {
            return res.status(400).json({
                message: "Unable to update the user fields",
                error: error.message
            })
        })
    }

}module.exports=updateController;