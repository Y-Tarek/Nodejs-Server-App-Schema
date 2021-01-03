const express = require('express');
const config = require('./config/config');
const mongodb = require('mongodb');
const mongoose = require('./db/mongoose');
const {authinticate} = require('./Middleware/authinticate');
const bodyparser = require('body-parser');
const _ = require('lodash');
const {User} = require('./db/models/user');
var address; // Put your ip address in that variable
require('express-group-routes');
const app = express();
app.use(bodyparser.json());

//Public Routes
app.group('/api/public',(router) => {
    router.get('/',(req,res) => {
        res.send('Hello');
    });
})
//Guset Routes
app.group('/api/guest',(router) => {
    router.post('/register',(req,res) => {
       var body = _.pick(req.body,['email', 'password']);
       var user = new User(body);
        user.save().then(() => {
            res.status(200).send(user);
        }).catch((e) => {res.status(400).send(e)})
    })

    router.post('/login',(req,res) => {
        var body = _.pick(req.body,['email','password']);
        User.findByCredintials(body.email,body.password).then((user) => {
         return user.generateAuthToken().then((token) => {
             res.header('Authorization','Bearer'+token).status(200).send(user);
         })
        }).catch((e) => {console.log(e);res.status(400).send(e)})
    })
})

//Auth Routes
app.group('/api/auth',(router) => {
    router.delete('/logout',authinticate,(req,res) => {
        var user = req.user;
        return user.removeToken(req.token).then(() => {
            res.status(200).send();
        })
    })
})

app.listen(process.env.PORT,address,(e) => {
    if(e){
        console.log("an error occured",e);
    }
    console.log(`http://${address}:${process.env.PORT}`);
})
