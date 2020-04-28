const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const {check,validationResult} = require('express-validator');
const bodyParser = require('body-parser');
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const objectId =require('mongodb').ObjectId;

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/',jsonParser,[auth,[
    check('status','Status is required')
    .not()
    .isEmpty(),
    check('skills','skills is required')
    .not()
    .isEmpty()
]],
async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }
    const{
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build profile object
    const profileFields={};
    profileFields.user = req.user.id;
    if(company) profileFields.company= company;
    if(website) profileFields.website= website;
    if(location) profileFields.location= location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername= githubusername;
    if(skills)
    {
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }
    console.log(profileFields.skills);
    // Build social object
    profileFields.social={};
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(linkedin) profileFields.social.linkedin=linkedin;
    if(instagram) profileFields.social.instagram=instagram;

    try{
        let profile = await Profile.findOne({user:req.user.id});
        if(profile)
        {
            //update
            
            profile= await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );
            console.log(user);
            return res.json(profile);
        }
        //Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/me
// @desc    Get current users profile
// @acess   Private

router.get('/me',auth,async (req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name','avatar']
        );
        if(!profile){
            return res.status(400).json({msg:'There is no profile for this user'});
        }
        res.json(profile);
    }
    catch(err)
    {
        console.log(err.message);
        res.status(500).send('Server Error');
    }

});



//  @route   GET api/profiles
//  @desc    GET all profiles
//  @access  Public
router.get('/',async(req,res)=>{
    try{
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//  @route   GET api/profiles/user/:user_id
//  @desc    GET profile by user ID
//  @access  Public
router.get('/user/:user_id',async(req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile) return res.status(400).json({msg:'There is no profile for this user'}); 
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//  @route   Delete api/profile
//  @desc    Delete profile,user & posts
//  @access  Private
router.delete('/',auth,async(req,res)=>{
    try{
        
        //Delete all posts of the user
        await Post.deleteMany({user:req.user.id});

        //Remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        //Remove user
        await User.findOneAndRemove({_id:req.user.id}).populate('user',['name','avatar']);

        res.json({msg:'User removed'});
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
router.put(
    '/experience',jsonParser,
    [auth,[
        check('title','Title is required').not().isEmpty(),
        check('company','Company is required').not().isEmpty(),
        check('from','From date is required').not().isEmpty()
    ]],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()});
        }
        const{
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }=req.body;

        const newExp={
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({user:req.user.id});
            profile.experience.unshift(newExp);//push newExp into experience
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);
// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private

router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id});
        //Get remove index
        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);//find experience with exp_id in params
        profile.experience.splice(removeIndex,1);//remove 1 elements
        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route  PUT api/profile/education
// @desc   Add profile eduacation
// @access Private
router.put(
    '/education',jsonParser,
    [auth,[
        check('school','School is required').not().isEmpty(),
        check('degree','degree is required').not().isEmpty(),
        check('fieldofstudy','fieldofstudy is required').not().isEmpty(),
        check('from','From date is required').not().isEmpty()
    ]],
    async (req,res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({errors: errors.array()});
        }
        const{
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }=req.body;

        const newEdu={
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({user:req.user.id});
            profile.education.unshift(newEdu);//push newExp into experience
            await profile.save(newEdu);
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route  DELETE api/profile/education/:exp_id
// @desc   Delete eduacation from profile
// @access Private

router.delete('/education/:edu_id',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user:req.user.id});
        //Get remove index
        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);//find experience with exp_id in params
        profile.education.splice(removeIndex,1);//remove 1 elements
        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});
module.exports = router;