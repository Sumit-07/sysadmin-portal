const express=require("express");
const postController=require("../controllers/postController");

const router=express.Router();
router.post('/register',postController.register);
router.get('/admins',postController.showAll);
router.get('/:id',postController.showAdmin);
router.patch('/:id',postController.update);
module.exports=router;