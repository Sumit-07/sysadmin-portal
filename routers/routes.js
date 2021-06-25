require('dotenv').config();
const express=require("express");
const postController=require("../controllers/postController");
const authController=require("../controllers/authController");
const createUser = require("../controllers/createUser");
const sysAdminController=require("../controllers/sysAdminController");
const updateController=require("../controllers/updateController");
const customerController=require("../controllers/customerController");
const router=express.Router();
const validator=require("../helpers/validator");
// JWT
const jwt = require('express-jwt');
const jwtOptions = { secret: process.env.JWT_SECRET, algorithms: ['HS256'], requestProperty: 'auth' };

router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',jwt(jwtOptions),authController.logout);
router.get('/admin',jwt(jwtOptions),sysAdminController.getAdmins);
router.get('/auth',jwt(jwtOptions),authController.alreadyLoggedIn);

router.post('/admin/createManager',jwt(jwtOptions),createUser.createManager); //For both branch manager and corporate manager
router.post('/admin/createCashier',jwt(jwtOptions),createUser.createCashier);
router.post('/admin/createCS',jwt(jwtOptions),createUser.createCollectionSpecialists);

router.post('/admin/getUser',jwt(jwtOptions),updateController.getUser); //gets the data of current user
router.patch('/admin/updateCMSuser',jwt(jwtOptions),updateController.updateCMSuser); //cashier, branch manager and corporate manager
router.patch('/admin/updateCS',jwt(jwtOptions),updateController.updateCS);

//Customers data updation
router.patch('/admin/getCustomerInfo',jwt(jwtOptions),customerController.getCustomerInfo);
router.patch('/admin/updateCustomer',jwt(jwtOptions),customerController.updateCustomerInfo);
router.patch('/admin/customerToCsMapping',jwt(jwtOptions),customerController.assignCsToCustomer);
// router.get('/admins',postController.showAll);
// router.get('/:id',postController.showAdmin);
// router.patch('/:id',postController.update);

module.exports=router;