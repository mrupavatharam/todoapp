require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {ObjectID} = require('mongodb');

var {mongoose} = require('./DB/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;



app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${req.method}    ${req.url}`);
    next();
})

app.get('/',(req, res)=>{
    res.send("response!!");
})
app.post('/todo', (req, res)=> {
    // console.log(req.body);
    var newTodo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });
    newTodo.save().then((result)=>{
        // console.log("Record Insertion Sucessful !",result);
        res.send(result);
    }).catch((error) => {
        // console.log("Error in Inserting Record !", error);
        res.status(400).send(error);
    });
})

app.get('/todos',(req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }).catch((error) => {
        res.status(400).send(error);
    })

})

app.get('/todo/:id', (req, res) => {
    var todoId = req.params.id;
    if(! ObjectID.isValid(todoId))
    {
        return res.status(404).send({"message":"Invalid Object Id"});
    }
    Todo.findById(todoId).then((todo) =>{
        if(!todo)
        {
            return res.status(404).send({"message":"Todo Not found"});
        }
        return res.send({todo});
    })
    .catch( (error) => {
        res.status(400).send(error);
    })
})

app.delete('/todo/:id',(req, res) => {
    var todoId = req.params.id;
    if(! ObjectID.isValid(todoId))
    {
        return res.status(404).send({"message":"Invalid Object Id"});
    }
    Todo.findByIdAndRemove(todoId).then((todo)=>{
        if(!todo)
        {
            return res.status(404).send({"message":"Todo Not found"});
        }
        return res.send({todo});
    })
    .catch((error)=>{
        res.status(400).send(error);
    })
})

app.patch('/todo/:id',(req, res) => {
    var todoId = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(! ObjectID.isValid(todoId))
    {
        return res.status(404).send({"message":"Invalid Object Id"});
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(todoId, { $set: body}, {new: true})
    .then((todo)=>{
        if(! todo) return res.status(404).send({"message":"Todo Not Found"})
        return res.send({todo});
    })
    .catch((err) => {

    })

})

//user routes

app.post('/user', (req, res) => {
    var body = _.pick(req.body,['email','name','password']);
    var user = new 
    User(body);
    user.save()
    .then((result) => {      
        var token = user.generateAuthTokens();
        return token;
    })
    .then((token)=>{
        console.log("in controller",token);
        res.header('x-auth', token).send(user);
    })
    .catch((error) => {
        console.log(error);
        res.status(400).send(error);
    })
})

















app.listen(port, ()=>{
    console.log(`Server Started on Port ${port} in '${process.env.NODE_ENV}' mode`);
})

module.exports  = {app};