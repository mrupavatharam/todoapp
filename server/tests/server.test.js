const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const mockTodos = [
    {
        "text":"Test 11 todo for testing"
    },
    {
        "text":"Test 12 todo for testing"
    }
];

beforeEach((done)=>{
    Todo.remove().then( () => {
        return Todo.insertMany(mockTodos);
    }).then(()=>done());
});

describe('POST /todo',()=>{
    it('should create a new todo',(done)=>{
         var text = 'text todo text';
         request(app)
         .post('/todo')
         .send({text})
         .expect(200)
         .expect((res) => {
            expect(res.body.text).toBe(text);
         })
         .end((err, res) => {
             if(err)
             {
                 return done(err)
             }
             Todo.find({text}).then((todos) => {
                 expect(todos.length).toBe(1);
                 expect(todos[0].text).toBe(text);
                 done();
             }).catch((err)=>{
                 done(err);
             })
         })
    });

    it('should not create todo with invalid data',(done)=>{
        request(app)
        .post('/todo')
        .send({})
        .expect(400)
        .end((err, res)=>{
            if(err)
            {
                return done(err)
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((err)=>{
                done(err);
            })
        })
    })


})


describe('GET /todos',() => {

    it('should get all todos',(done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2)
        })
        .end(done) 
    })


})