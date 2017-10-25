const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const mockTodos = [
    {
        _id: new ObjectID(),
        "text":"Test 11 todo for testing"
    },
    {
        _id:new ObjectID(), 
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

describe('GET /todo with Id', ()=>{
    it('should get result with id',(done)=>{
        request(app)
        .get(`/todo/${mockTodos[1]._id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(mockTodos[1].text)
        })
        .end(done)
    })

    it('should return invalid object Id',(done)=>{
        request(app)
        .get('/todo/12313')
        .expect(404)
        .expect((err)=>{
            expect(err.body.message).toBe('Invalid Object Id')
        })
        .end(done)
    })

    it('should return 404 if todo not found',(done)=>{
        var tempObjId = new ObjectID();
        request(app)
        .get(`/todo/${tempObjId}`)
        .expect(404)
        .expect((err)=>{
            expect(err.body.message).toBe('Todo Not found')
        })
        .end(done)
    })

})


describe('DELETE /todo with Id', () =>{
    
        it('should return invalid objectId',(done) =>{
            request(app)
            .delete('/todo/12312312312')
            .expect(404)
            .expect((err)=>{
                // console.log(err);
                expect(err.body.message).toBe('Invalid Object Id')
            })
            .end(done)
        })
    
        it('should get result with id', (done)=>{
            var delTodoId = mockTodos[0]._id.toHexString();
            request(app)
            .delete(`/todo/${delTodoId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(delTodoId);
            })
            .end((err, res) => {
                if(err)
                {
                    return done(err);
                }
                Todo.findById(delTodoId).then((todo)=>{
                    expect(todo).toBeFalsy();
                    done();
                })
                .catch((e) => done(e));
            });
        });
    
        it('should return 404 not found', (done) =>{
            var delTodoId = new ObjectID();
            request(app)
            .delete(`/todo/${delTodoId}`)
            .expect(404)
            .expect((err)=>{
                expect(err.body.message).toBe('Todo Not found')
            })
            .end(done)
        })
    
    })
    
    
    
