const validator = require("../helpers/validator");
const models = require("../models");
const md5=require("md5");
const constants=require("../helpers/constants");

//const db=require("../config/database");

const roles={
    Manager:"M",
    Corporate_Manager:"C",
    Cashier:"A",
    Collection_Specialist:"F"
};

class createUser{
    
    
    //Used for both corporate manager and manager
    static createManager(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(501).json({
                message : "Please log in first as System Admin to create a User"
            })
        }
        console.log(req.body);
        if(validator.isNotExist(req.body.first_name) || validator.isNotExist(req.body.last_name) 
        || validator.isNotExist(req.body.city)
        || validator.isNotExist(req.body.branch) || validator.isNotExist(req.body.email) 
        || validator.isNotExist(req.body.password) || validator.isNotExist(req.body.role)){
            return res.status(401).json({
                message:"Please enter the necessary fields!!"
            })
        }
        //Check if duplicate exists
        const admin=req.auth;
        models.users.findAll({
            where:{
                email:req.body.email
            }
        }).then(result=>{
            if(result.length>0){
                return res.status(500).json({
                    message:"Email Id already registered!"
                })
            } else {
               
                var createdUser={
                    email:req.body.email
                }
                const user=req.body;
                constants.UserPublicAttributes.forEach(att=>{
                    if(validator.isExist(user[att])){
                        createdUser[att]=user[att];
                    }
                });
                createdUser.password=md5(user.password);
                createdUser.createdBy=admin.first_name;
                createdUser.active="Y";
        
                 models.users.create(createdUser).then(result=>{
                     console.log(result);
                    //Create activity log

                        const action=admin.first_name+" "+admin.last_name
                        +" created a new user in the app successfully";
                        const activityLog={
                            action_type:"Created new user : "+user.first_name+" "+
                             user.last_name+ " ; Role : "+user.role,

                            action:action,
                            username:admin.first_name+" "+admin.last_name

                        };
                        models.sys_admin_activity_logs.create(activityLog).then(result=>{
                            console.log("Activity log created!!")
                        }).catch(error=>{
                            console.log("Failed to create activity log "+error.message);
                        })

                   return res.status(200).json({
                        message: "A new Manager was created!"
                    })
                }).catch(error=>{
                    return res.status(409).json({
                        message: "Couldn't create the user, please conatct the admin",
                        error:error.message
                    })
                })
            }
        }).catch(error=>{
            return res.status(400).json({
                message: "Please try again later",
                error: error.message
            });
        });

    }
        static async createCashier(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(501).json({
                message : "Please log in first as System Admin to create a User"
            })
        }
        console.log(req.body);
        if(validator.isNotExist(req.body.first_name) || validator.isNotExist(req.body.last_name) 
        || validator.isNotExist(req.body.city)
        || validator.isNotExist(req.body.branch) || validator.isNotExist(req.body.email) 
        || validator.isNotExist(req.body.password) || validator.isNotExist(req.body.role)){
            return res.status(401).json({
                message:"Please enter the necessary fields!!"
            })
        }
        let client_code=await models.users.max('client_code').then(result=>{
            if(validator.isNotExist(result)){
                return 0
            }else{
                console.log(result);
                return result
                
            }}).catch(error=>{
                console.log(error.stack);
            });
        let agent_id=await models.users.max('agent_id').then(result=>{
            if(validator.isNotExist(result)){
                return 0
            }else{
                console.log(result);
                return result;
            }}).catch(error=>{
                console.log(error.message);
            });

            
        //Check if duplicate exists
        const admin=req.auth;
        models.users.findAll({
            where:{
                email:req.body.email
            }
        }).then(result=>{
            if(result.length>0){
                return res.status(500).json({
                    message:"Email Id already registered!"
                })
            } else {
                var createdUser={
                    email:req.body.email
                }
                const user=req.body;
                constants.UserPublicAttributes.forEach(att=>{
                    if(validator.isExist(user[att])){
                        createdUser[att]=user[att];
                    }
                });
                createdUser.password=md5(req.body.password);
                createdUser.createdBy=req.auth.first_name;
                createdUser.active="Y";

                createdUser.agent_id=agent_id+1;
                createdUser.client_code=client_code+1;
                
                console.log("Client code and Agent Id "+ client_code + " "+agent_id);
                
                
                 models.users.create(createdUser).then(result=>{
                     console.log(result);
                    //Create activity log

                        const action=admin.first_name+" "+admin.last_name
                        +" created a new user in the app successfully";
                        const activityLog={
                            action_type:"Created new user : "+user.first_name+" "+
                             user.last_name+ " ; Role : "+user.role,

                            action:action,
                            username:admin.first_name+" "+admin.last_name

                        };
                        models.sys_admin_activity_logs.create(activityLog).then(result=>{
                            console.log("Activity log created!!")
                        }).catch(error=>{
                            console.log("Failed to create activity log "+error.message);
                        })

                   return res.status(200).json({
                        message: "A new Cashier was created!"
                    })
                }).catch(error=>{
                    return res.status(409).json({
                        message: "Couldn't create the user, please conatct the admin",
                        error:error.message
                    })
                })
            }
        }).catch(error=>{
            return res.status(400).json({
                message: "Please try again later",
                error: error.message
            });
        });

    }

    //Creating new Collection specialist
    static async createCollectionSpecialists(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(501).json({
                message : "Please log in first as System Admin to create a User"
            })
        }
        console.log(req.body);
        if(validator.isNotExist(req.body.first_name) || validator.isNotExist(req.body.last_name) 
        || validator.isNotExist(req.body.city)
        || validator.isNotExist(req.body.branch) || validator.isNotExist(req.body.country_code) 
        || validator.isNotExist(req.body.phone_number) || validator.isNotExist(req.body.role)){
            return res.status(401).json({
                message:"Please enter the necessary fields!!"
            })
        }
        let client_code=await models.users.max('client_code').then(result=>{
            if(validator.isNotExist(result)){
                return 0
            }else{
                console.log(result);
                return result
                
            }}).catch(error=>{
                console.log(error.stack);
            });
        let agent_id=await models.users.max('agent_id').then(result=>{
            if(validator.isNotExist(result)){
                return 0
            }else{
                console.log(result);
                return result;
            }}).catch(error=>{
                console.log(error.message);
            });
        var manager_id;
        if(validator.isExist(req.body.manager_email)){
            req.body.manager_id =await models.users.findOne({
                where:{
                    email:req.body.manager_email
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
        }
        //Check if duplicate exists
        console.log("Manager id is : "+req.body.manager_id);
        const admin=req.auth;
        models.users.findAll({
            where:{
                phone_number:req.body.phone_number
            }
        }).then(result=>{
            if(result.length>0){
                return res.status(500).json({
                    message:"Phone number already registered!"
                })
            } else {
                
                
                var createdUser={
                    createdBy:req.auth.first_name
                }
                const user=req.body;
                constants.UserPublicAttributes.forEach(att=>{
                    if(validator.isExist(user[att])){
                        createdUser[att]=user[att];
                    }
                });
                
                createdUser.active="Y";
                createdUser.agent_id=agent_id+1;
                createdUser.client_code=client_code+1;
                console.log("Client code and Agent Id "+ client_code + " "+agent_id);
                
                 models.users.create(createdUser).then(result=>{
                     console.log(result);
                    //Create activity log

                        const action=admin.first_name+" "+admin.last_name
                        +" created a new user in the app successfully";
                        const activityLog={
                            action_type:"Created new user : "+user.first_name+" "+
                             user.last_name+ " ; Role : "+user.role,

                            action:action,
                            username:admin.first_name+" "+admin.last_name

                        };
                        models.sys_admin_activity_logs.create(activityLog).then(result=>{
                            console.log("Activity log created!!")
                        }).catch(error=>{
                            console.log("Failed to create activity log "+error.message);
                        })

                   return res.status(200).json({
                        message: "A new Field Specialist was created!"
                    })
                }).catch(error=>{
                    return res.status(409).json({
                        message: "Couldn't create the user, please conatct the admin",
                        error:error.message
                    })
                })
            }
        }).catch(error=>{
            return res.status(400).json({
                message: "Please try again later",
                error: error.message
            });
        });

    }

   

}module.exports=createUser;