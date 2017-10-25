const express = require('express');
const bodyParser = require('body-parser');
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
        return res.status(404).send({messsage:"Invalid Object Id"});
    }
    Todo.findById(todoId).then((todo) =>{
        if(!todo)
        {
            return res.status(404).send({message:"Todo Not found"});
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
        return res.status(404).send({message:"Invalid Object Id"});
    }
    Todo.findByIdAndRemove(todoId).then((todo)=>{
        if(!todo)
        {
            return res.status(404).send({message:"Todo Not Found"});
        }
        return res.send({todo});
    })
    .catch((error)=>{
        res.status(400).send(error);
    })
})



app.listen(port, ()=>{
    console.log(`Server Started on Port ${port}`);
})

module.exports  = {app};