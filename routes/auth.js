const router=require('express').Router();
const User=require('../model/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {registerValidation, loginValidation} =require('../validation');


//Register
router.post('/register',async (req,res)=>{
    //validate data before create
    const {error}=registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check the user already in the database
    const emailExist=await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send("Email already exists");

    //Hash password
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(req.body.password,salt);

    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword
    });

    try{
        const savedUser= await user.save();
        res.send({user:user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

//LogIn
router.post('/login',async (req,res)=>{
    //validate data before login
    const {error}=loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if the email exist
    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send("Email or password is wrong");
    //password is correct
    const validPass=await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send("Email or password is wrong");

    //create and assign a token
    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);


});


module.exports=router;