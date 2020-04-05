const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/users')
const {userOne, userOneId, setupDatabase} = require('./fixtures/db')





beforeEach(setupDatabase)

// afterEach(()=>{
//     console.log('AfterEach')
// })

test("Should sign up a new user", async ()=>{
    const response = await request(app).post('/users').send({
        name : "Ahmad",
        email : "gillAhmad@gmail.com",
        password : "MyPass777!"
    }).expect(201)

    //Assert that the database was changed correctly.
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    expect(response.body).toMatchObject({
        user : {
            name : 'Ahmad',
            email : 'gillAhmad@gmail.com'

        },
        token : user.tokens[0].token
    })

    //Assertions
    expect(user.password).not.toBe('MyPass777!')
})


test("Should Login existing User", async ()=>{
    const response = await request(app).post("/users/login").send({
        email : userOne.email, 
        password : userOne.password 
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})


test("Should not login existing User", async ()=>{
    await request(app)
    .post("/users/login")
    .send({
        email : userOne.email, 
        password : userOne.password + 'jk'
    })
    .expect(400)
})

test('Should get profile for user', async()=>{
    await request(app)
    .get('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)    
})

test('Should not get profile for user when unauthenticated.', async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)    
})

test('Should delete profile for user', async()=>{
    await request(app)
    .delete('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for user when unauthenticated.', async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)    
})

test('should upload avatar image', async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', "tests\\fixtures\\ahmadgill.jpg")
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        name : 'Jess'
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')

})

test('should not update un-valid user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        location : 'Jess'
    }).expect(400)
    // const user = await User.findById(userOneId)
    // expect(user.name).toEqual('Jess')

})