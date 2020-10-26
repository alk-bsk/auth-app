const router=require('express').Router();
const varify=require('./verifyToken');

router.get('/',varify,(req,res)=>{
    res.send(req.user);
})

module.exports=router;