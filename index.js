const { Router } = require('express');
const express =require('express');
const app=express();
const dotenv = require('dotenv');
const mongoose=require('mongoose');
//import Routes
const authRoute=require('./routes/auth');
const postRoute=require('./routes/post');

dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT,{ useUnifiedTopology: true,useNewUrlParser: true },()=>console.log('connected to db'));

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/posts',postRoute);

app.listen(3000,()=>console.log('server are on and running'));