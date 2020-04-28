const express = require('express');
const router = express.Router();
const auth=require('../../middleware/auth');
const User = require('../../models/User');
const bodyParser = require('body-parser');
const bcrypt= require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check,validationResult } = require('express-validator');


// @route   GET api/auth
// @desc    Test route
// @acess   Public
//auth in the middle is use to protect the route
router.get('/',auth,async (req,res)=> {
    try{
    const user = await User.findById(req.user.id).select('-password');
    //req.user.id is token id from middleware auth
    res.json(user);
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('server error');

    }
});

//for sign in

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.post('/',jsonParser,[
check('email','Please include a valid email').isEmail(),
check('password','Password is required')
.exists()
],
async (req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const {email,password} =req.body;
    try{
        let user = await User.findOne({email});
        
        if(!user){
            res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }

    
    //See if user exists

    //Get users gravatar

    //Encrypt password

    //Return jsonwebtoken
   
    const isMatch = await bcrypt.compare(password,user.password);//user.password is hashed password
    if(!isMatch)
    {
        res.status(400).json({errors:[{msg:'Invalid Credentials'}]}); 
    }

    const payload={
        user:{
            id: user.id
        }
    }
    jwt.sign(payload,config.get('jwtSecret'),
    {expiresIn:360000},
    (err,token)=>{
        if(err) throw err;
        res.json({token});
    });
   }catch(err)
   {
    console.error(err.message);
    res.status(500).send('Server error');
   }
  }
);

module.exports = router;