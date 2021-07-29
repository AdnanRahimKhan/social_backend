const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

var cors = require('cors')
router.use(cors()) // Use this after the variable declaration
////
router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// Register User
router.post("/register",async (req,res)=>{
   
    try{
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
       
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    
    }catch(err){
        res.status(500).json(err)
    }
});

//Login Users

router.post("/login", async (req,res)=>{
    try{
    const user = await  User.findOne({email:req.body.email});
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong Password");
    
    res.status(200).json(user);

    }catch(err){
        res.status(500).json(err)
    }
}),

module.exports = router