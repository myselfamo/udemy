//jshint esversion:6
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
require('dotenv').config()
const encrypt=require("mongoose-encryption");
const app=express();
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});


const secret="thisisimportantsecret";
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});
const User=mongoose.model("User",userSchema);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine",'ejs');

app.get("/",function(req,res){
    res.render("home");
})

app.get("/register",function(req,res){
    res.render("register");
})
app.get("/login",function(req,res){
    res.render("login");
})
app.post("/register",function(req,res){
    const user1=new User({
        email:req.body.username,
        password:req.body.password
    });
    user1.save(function(err){
        if(err){
            res.send("error")
        }else{
            res.render("secrets")
        }
    })
})


app.post("/login",function(req,res){
    const userEmail=req.body.username;
    const passCode=req.body.password;

    User.findOne({email:userEmail},function(err,foundItem){
        if(err){
            res.send("error no data found");
        }else{
            if(foundItem){
                if(foundItem.password===passCode){
                    res.render("secrets");
                }else{
                    res.send("Error password");
                }
            }
        }
    })
})



app.listen(3000,function(){
    console.log("Hello server started");
})