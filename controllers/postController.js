
const models=require("../models");
function register(req,res){
    const {first_name,last_name,country_code,phone_number,email,password} =req.body;
    const admin={
        first_name:first_name,
        last_name:last_name,
        country_code:country_code,
        phone_number:phone_number,
        email:email,
        password:password,
    };
    models.sysadmin.create(admin).then(result =>{
        res.status(201).json({
            message:"Successfully inserted"
        })
    }).catch(error => {
        res.status(500).json({
            message:error.message,
        });
    });
}

function showAdmin(req,res){
    const id=req.params.id;
    models.sysadmin.findByPk(id).then(result=>{
        res.status(201).json(result)
    }).catch(error =>{
        res.status(500).json({
            message:error.message,
        });
    })
}

function showAll(req,res){
    models.sysadmin.findAll().then(result =>{
        res.status(200).json(result)
    }).catch(error => {
        res.status(500).json({
            message:error.message
        })
    })
}

function update(req,res){
    const id=req.params.id;
    const {first_name,last_name,country_code,phone_number,email,password} =req.body;
    const updatedadmin={
        first_name:first_name,
        last_name:last_name,
        country_code:country_code,
        phone_number:phone_number,
        email:email,
        password:password,
    };
    models.sysadmin.update(updatedadmin,{where:
        {id:id}
    }).then(result =>{
        res.status(201).json({
            message:"Successfully inserted",
            post:result
        })
    }).catch(error => {
        res.status(500).json({
            message:error.message,
        });
    });
}
module.exports={
    register:register,
    showAdmin:showAdmin,
    showAll:showAll,
    update:update
}