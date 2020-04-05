const request = require('supertest')
const Task = require('../src/models/Tasks')
const {
    userOne, 
    userOneId, 
    setupDatabase, 
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree
} = require('./fixtures/db')
const app = require('../src/app')

beforeEach(setupDatabase)

test('Should Create task for user', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        descrption : 'From my test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false);
})

test('should fetch user Tasks', async ()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    
    expect(response.body.length).toEqual(2)
})

test('should not delete other user task', async()=>{
   const response = await request(app)
   .delete(`/delete/${taskOne._id}`)
   .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
   .send().
   expect(404)

   const task = await Task.findById(taskOne._id)
   expect(task).not.toBeNull()
})