const models = require("../models/sys_admin_activity_logs");

class logbuilder{

    static createActivityLog(admin,user,role){
        //Create activity log
        
        const action=admin.first_name+" "+admin.last_name+" created a new user in the app successfully";
        const activityLog={
            action_type:"Created new user : "+user.first_name+" "+ user.last_name+ " ; Role : "+role,
            action:action,
            username:admin.first_name+" "+admin.last_name

        };
        models.sys_admin_activity_logs.create(activityLog).then(result=>{
            console.log("Activity log created!!")
        }).catch(error=>{
            console.log("Failed to create activity log "+error.message);
        })

    //     return res.status(200).json({
    //        message:"User created successfully!!"
    //    })
    }
} module.exports = logbuilder;