const models = require("../models");
const validator = require("../helpers/validator");
const constants = require("../helpers/constants");
const { isNotExist } = require("../helpers/validator");

class customerController{
    //Get customer details
    static async getCustomerInfo(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(501).json({
                message : "Please log in first as System Admin to create a User"
            })
        }
        
        if(validator.isNotExist(req.body.full_name) || validator.isNotExist(req.body.acct_number)){
            return res.status(409).json({
                message: "Please enter all the necessary fields (marked with *)"
            })
        }

        //Extracting the customer id from the sales table
        const customer_id = await models.sales.findOne({
            where:{
                acct_number : req.body.acct_number
            },
            attributes:['customer_id']
        }).then(result =>{
            if(validator.isNotExist(result)){
                return res.status(404).json({
                    message: "Customer account number doesn't exits"
                })
            } else {
                return result.customer_id;
            }
        })

        models.customers.findByPk(customer_id).then(result =>{
            if(validator.isExist(result)){
            var finalres = {};
            constants.CustomerPersonalAttributes.forEach(att=>{
                if(validator.isExist(result[att])){
                    finalres[att]=result[att];
                }
            });
            finalres.acct_number = req.body.acct_number;
            return res.status(200).json(finalres);
            }else {
                return res.status(404).json({
                    message: "User not found"
                })
            }}).catch(error =>{
            return res.status(401).json({
                message : error.message
            })
                
        })



    }

    //Compulsory fields to identify the customer : Name, Account Number
    static async updateCustomerInfo(req,res){
        if(!validator.isLoggedIn(req.auth)){
            return res.status(501).json({
                message : "Please log in first as System Admin to create a User"
            })
        }
        
        if(validator.isNotExist(req.body.full_name) || validator.isNotExist(req.body.acct_number)){
            return res.status(409).json({
                message: "Please enter all the necessary fields (marked with *)"
            })
        }

        //Extracting the customer id from the sales table
        const customer_id = await models.sales.findOne({
            where:{
                acct_number : req.body.acct_number
            },
            attributes:['customer_id']
        }).then(result =>{
            if(validator.isNotExist(result)){
                return res.status(404).json({
                    message: "Customer account number doesn't exits"
                })
            } else {
                return result.customer_id;
            }
        })
        const customer = req.body;
        const admin = req.auth;

        var updatedCustomer = {
            updatedBy: admin.first_name
        }

        constants.CustomerPersonalAttributes.forEach(att=>{
            if(customer[att]!=""){
                updatedCustomer[att]=customer[att];
            }
        });
        console.log(updatedCustomer);
        models.customers.update(updatedCustomer,{
            where:{
                id: customer_id
            }
        }).then(result =>{
             //Create activity log

             const action=admin.first_name+" "+admin.last_name
             +" updated personal information of the customer with id : "+customer_id+ "in the app successfully";
             const activityLog={
                 action_type:"Updated the customer : "+customer.full_name,
                 action:action,
                 username:admin.first_name+" "+admin.last_name

             };
             models.sys_admin_activity_logs.create(activityLog).then(result=>{
                 console.log("Activity log created!!")
             }).catch(error=>{
                 console.log("Failed to create activity log "+error.message);
             })

             return res.status(200).json({
                 message: "Customer updated successfully!!"
             })
        }).catch(error=>{
            return res.status(409).json({
                message: "Request failed!! Please try again later",
                error: error.message
            })
        })
    }

    
    static async assignCsToCustomer(req,res){

        if(!validator.isLoggedIn(req.auth)){
            return res.status(409).json({
                message: "Please login to avail this feature"
            })
        }
        
        //Compilsory fields : Customer's account number, CS Name and phone number, Visit date taken in input as day,month and year
        if(isNotExist(req.body.acct_number) || isNotExist(req.body.cs_phone_number) 
        || isNotExist(req.body.cs_country_code) || isNotExist(req.body.visit_date)){
            res.status(409).json({
                message: "Please enter all the necessary fields!"
            })
        }

        //Get client code of that cs
        var client_code = null;
         await models.users.findOne({
            where:{
                country_code: req.body.cs_country_code,
                phone_number: req.body.cs_phone_number
            }
        }).then(result =>{
            if(validator.isNotExist(result)){
               console.log("Colection Specialist not found!! Please add collection specialist before assigning.");
            } else{
                client_code = result.client_code;
            }
        }).catch(error =>{
            console.log("Unable to find user at this moment, please try again later");
        })
        console.log("Client code is : "+client_code);


        //Get customer id from sales table
       var customer_id = null; 
        await models.sales.findOne({
            where:{
                acct_number : req.body.acct_number
            },
        }).then(result =>{
            if(validator.isNotExist(result)){
                console.log("Errored result");
                
            } else {
                console.log(result);
                customer_id = result.customer_id;
            }
        }).catch(error =>{
           console.log("Unable to find customer at this moment, please try again later");
        })
        console.log("Customer id is : "+customer_id);

        if(customer_id===null || client_code===null){
            return res.status(404).json({
                message: "Please check the account number and CS phone number again"
        })}

        models.customers.update({
            client_code: client_code
        },{ where:{
            id: customer_id
        }}).then(result =>{
            console.log("Data updated in the customer's table")
        }).catch(error =>{
            console.log("Unable to update data in the customer's table : "+error.message);
        });

        const date = new Date();
        const year = date.getFullYear().toString();
        const month = (date.getMonth()+1).toString();
        //const visit_date= new Date(req.body.year,req.body.month,req.body.day).toString();

        const recommendsEntry = {
            client_code: client_code,
            acct_number: req.body.acct_number,
            year: year,
            month: month,
            visit_date: req.body.visit_date,
            recommendation_text: req.body.recommends
        };

        if(validator.isExist(client_code)){
            console.log("Client code of the user is : "+client_code);
        }

        models.recommends.findOne({where: {
            acct_number: req.body.acct_number,
            year: year,
            month: month
        }}).then(function (foundItem) {
            if (!foundItem) {
                // Item not found, create a new one
                models.recommends.create(recommendsEntry)
                    .then(result =>{
                        return res.status(200).json({
                            message: "A new recommendation was created!"
                        })
                    }).catch(error =>{
                        return res.status(401).json({
                            message:"Unable to add recommendation",
                            error: error.message
                        })
                    });
            } else {
                // Found an item, update it
                models.recommends.update(recommendsEntry, {where: {
                    acct_number : req.body.acct_number,
                    year: year, month:month
                }})
                    .then(result=>{
                        return res.status(200).json({
                            message: "Recommendation was updated!"
                        })
                    })
                    .catch(error =>{
                        return res.status(400).json({
                            message:"Unable to add recommendation",
                            error: error.message
                        })
                    });
                ;
            }
        }).catch(error=>{
            return res.status(400).json({
                message:"Unable to add recommendation",
                error: error.message
            })
        });
    
      
    }

}module.exports = customerController;