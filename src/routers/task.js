const express = require('express')
const Task = require("../models/Tasks")
const auth  =require("../middleware/auth")
const router = new express.Router()



router.post("/tasks", auth, async(req, res)=>{
    //const task = new Task(req.body)
    //assuming request body has subject and title
    const task = new Task({
        ...req.body,
        owner : req.user._id,
        completed : false

    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    // })
})

router.get("/tasks/related", auth, async (req, res)=>{
    console.log(req)
 
    try{
        const tasks = await Task.find({owner :  req.user._id})
        await req.user.populate('tasks').execPopulate()


                res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }

    
})

//GET/task?completed=true
//GET/tasks?limit=10&skip=20
//GET/tasks?sortBy=createdAt_asc
router.get("/tasks", auth, async (req, res)=>{
    console.log(req)
    const match = {}
    const sort = {}
    
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        //const tasks = await Task.find({owner :  req.user._id})
        //await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort: sort
            }
        }).execPopulate()
        console.log(req.user.tasks)
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }

    // Task.find({}).then((tasks)=>{
    //     res.status(200).send(tasks)
    // }).catch((error)=>{
    //     res.status(500)
    //     res.send(error)
    // })
})

router.get("/tasks/:id", auth, async (req, res)=>{
    const _id = req.params.id
    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner : req.user._id})
        if(!task){
            res.status(404).send("Task not found")
        }

        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send("User not found")
    //     }
    //     res.status(200).send(task)
    // }).catch((error)=>{
    //     res.status(500)
    //     res.send(error)
    // })
})


router.patch("/tasks/:id", auth, async (req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'descrption', 'completed']
    console.log(updates)
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({ error : "Invalid key"})
    }
    try{
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
        console.log(task)
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})
        //if there is no user
        if(!task){
            res.status(404).send("Task not found")
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()

        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/tasks/:id",auth, async (req, res)=>{
    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        
        if(!task){
            res.status(404).send("Task Not Found")
        }
        // await task.remove()
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router

