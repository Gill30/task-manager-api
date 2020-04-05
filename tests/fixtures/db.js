const mongoose = require('mongoose')
const jwt  = require('jsonwebtoken')
const User = require('../../src/models/users')
const Task = require('../../src/models/Tasks')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id : userOneId,
    name: 'Gill',
    email : "gill@gmail.com",
    password : "gillgill", 
    tokens: [{
        token : jwt.sign({ _id : userOneId}, process.env.JWT_SECRET)
    }]
} 

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id : userTwoId,
    name: 'Ahmad',
    email : "Ahmad@gmail.com",
    password : "gillgill", 
    tokens: [{
        token : jwt.sign({ _id : userTwoId}, process.env.JWT_SECRET)
    }]
} 


const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    descrption : 'Reach toefl',
    completed : false,
    owner : userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    descrption : 'Second Task',
    completed : true,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    descrption : 'Third Task',
    completed : true,
    owner : userTwo._id
}

const setupDatabase = async()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()

}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    setupDatabase,
    taskOne,
    taskTwo,
    taskThree
}