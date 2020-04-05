const app = require('./app')
// const express = require("express")
// require('./db/mongoose')
// const User = require("./models/users")
// const Task = require("./models/Tasks")
// const UserRouter = require("./routers/user")
// const TaskRouter = require("./routers/task")
const PORT = process.env.PORT 


// const app = express()
// const PORT = process.env.PORT  

// const multer = require('multer')
// const upload = multer({
//     dest : 'images',
//     limits : {
//         fileSize : 10000000
//     }, 
//     fileFilter (req, file, cb){
//         // !file.originalname.endsWith('.pdf')
//         if(!file.originalname.match(/\.(doc|docx|pdf|jpg|png)$/)){
//             return cb(new Error('Please upload a PDF'))
//         }

//         cb(undefined, true)
//     }
// })
// // upload.single('upload')
// const errorMiddleware = (req, res, next) =>{
//     throw new Error('From my middleware')
// }
// app.post('/upload', errorMiddleware ,(req, res)=>{
//     res.send()
// }, (error, req, res , next )=>{
//     res.status(400).send({error : error.message})
// })

// app.use((req, res, next)=>{
//     if(req.method === 'GET'){
//         res.status(401).send("GET not allowed")
//     }else{
//         next()
//     }
// })

// app.use(express.json())
// app.use(UserRouter)
// app.use(TaskRouter)
// const router = new express.Router()
// router.get("/test", (req,res)=>{
//     res.send("This is from my other Router")
// })
// app.use(router)


app.listen(PORT, ()=>{
    console.log("App is running")
    
})


  