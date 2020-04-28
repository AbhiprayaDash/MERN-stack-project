const express=require('express');
const connectDB =require('./config/db');

const app=express();

connectDB();

//Init Middleware
app.use(express.json({extended:false}));
//Define Routes
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));


//serve static assets in production
if(process.env.NODE_ENV==='production'){
    //set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
      });
}

const PORT =process.env.PORT||8000;

app.listen(PORT,() => console.log(`server started on port ${PORT}`));