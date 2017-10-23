const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./DB/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
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

app.listen(3000, ()=>{
    console.log("Server Started on Port 3000");
})

module.exports  = {app};