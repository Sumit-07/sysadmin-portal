const validator=require("../helpers/validator");
const models=require("../models");

class sysAdminController{

    static async getAdmins(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(401).json({
                message:"Authentication failed!!"
            })
        }
        models.sysadmin.findAll({
            attributes:['first_name','last_name','email']
        }).then(result =>{
            return res.json(result);
        }).catch(error=>{
            return res.status(404).json({
                message:"Unable to process request"
            })
        })
    }
} module.exports=sysAdminController;