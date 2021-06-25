const express=require("express");
const postsRoute = require("./routers/posts");
const routes = require("./routers/routes");
const app=express();
const {json,urlencoded}=require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(json());
app.use(urlencoded({'extended':true}));


app.use('/',routes);
app.get('/home',(req,res)=>{
console.log("Server is up");
res.send("Hello World!!");
})


module.exports=app;