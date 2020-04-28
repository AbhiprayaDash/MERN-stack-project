const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const bodyParser = require('body-parser');

const Post=require('../../models/Post');
const Profile=require('../../models/Profile');
const User=require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @acess   Private
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/',jsonParser,[auth,[
    check('text','Text is required').not().isEmpty()
]
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
    const user=await User.findById(req.user.id).select('-password');//user.id is from auth
    const newPost=new Post({
        text:req.body.text,
        name:user.name,//fetched from user database
        avatar:user.avatar,
        user:req.user.id
    });
    const post = await newPost.save();
    res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    }
);

// @route   GET api/posts/
// @desc    GET allposts
// @access  Public
router.get('/',async(req,res)=>{
    try{
        const post = await Post.find().sort({date:-1});
        res.json(post);
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind=='ObjectId')
        {
        return res.status(404).json({msg:'Post not found'}); 
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    GET post by ID
// @access  Private
router.get('/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post)
        {
         return res.status(404).json({msg:'Post not found'});   
        }
        res.json(post);
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind=='ObjectId')
        {
        return res.status(404).json({msg:'Post not found'}); 
        }
        res.status(500).send('Server Error');
    }
});
// @route   PUT api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete('/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.user.toString()!==req.user.id)//it checks for user in the post which is the id of user who posted the message
        {
         return res.status(401).json({msg:'user not Authorised'});   
        }
        await post.remove();
        res.json({msg:'Post removed'});
    }
    catch(err)
    {
        console.error(err.message);
        if(err.kind=='ObjectId')
        {
        return res.status(404).json({msg:'Post not found'}); 
        }
        res.status(500).send('Server Error');
    }
}); 

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        //check if the post has already liked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0)
        {
            return res.status(400).json({msg:'Post has not yet liked'});
        }
        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex);
        await post.save();
        res.json(post.likes);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id',auth,async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        //check if the post has already liked
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0)
        {
            return res.status(400).json({msg:'Post already liked'});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private

router.post('/comment/:id',jsonParser,[auth,[
    check('text','Text is required').not().isEmpty()
]
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
    const user=await User.findById(req.user.id).select('-password');//user.id is from auth
    const posts =await Post.findById(req.params.id);
    const newcomment=({
        text:req.body.text,
        name:user.name,//fetched from user database
        avatar:user.avatar,
        user:req.user.id
    });
    posts.comments.unshift(newcomment);//store inside comments in posts
    await posts.save();
    res.json(posts.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete post
// @access  Private

router.delete('/comment/:id/:comment_id',auth,async (req,res)=>{
    try {
    const posts =await Post.findById(req.params.id);
    //pull out comment
    const comment = posts.comments.find(comment =>comment.id===req.params.comment_id);
    //Make sure comment exists
    if(!comment)
    {
        return res.status(404).json({msg:'Comment doesnt exist' });
    }
    //check user
    if(comment.user.toString()!==req.user.id)
    {
        return res.status(401).json({msg:'User not authorized'});
    }
    //Get remove index
    const removeIndex=posts.comments.map(comment=>comment.user.toString().indexOf(req.user.id));
    posts.comments.splice(removeIndex,1);
    await posts.save()
    res.json(posts.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    }
);

module.exports = router;