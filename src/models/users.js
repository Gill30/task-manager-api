const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./Tasks')

const userSchema  = new mongoose.Schema({
    name: {
       type : String,
       trim : true,
       required : true
    } ,
    email : { 
        type :String,
        trim : true,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email in Invalide ")
            }
        }
    },
    type: {
        // A = Admin, U=User
        type : String,
        required : true
     },
    password : {
        type : String,
        required : true,
        minlength : 7, 
        trim : true, 
        validate(value){
            if(value.toLowerCase().includes("pasword")){
                throw new Error("Password cannot contain 'password'")
            }
        }
    },
    age :{
       type : Number,
       default : 0,
       validate(value){
           if(value<0){
               throw new Error("Age Must be + ve number")
           }
       }  
    } ,
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
   }, {
       timestamps : true
   })

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField :  'owner'
})
userSchema.methods.toJSON= function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token })
    user.save()
    return token
}
userSchema.statics.findByCredententials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}
//Hash the user password before saving
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
//Delete user tasks when user us removed
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({ owner : user._id})
    next()
})
const User = mongoose.model('User', userSchema);


module.exports = User