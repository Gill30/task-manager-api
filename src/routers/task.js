const express = require('express')
const Task = require("../models/Tasks")
const User_related_Tasks = require("../models/user_related_tasks")
const auth  =require("../middleware/auth")
const router = new express.Router()


//Create Task
router.post("/tasks", auth, async(req, res)=>{
    //const task = new Task(req.body)
    //assuming request body has subject and title
    
    const task = new Task({
        ...req.body,
        owner : req.user._id,
        completed : false

    })

    
    try{
        
        if(task.type == 'R'){
            
            const parentTask = await Task.findOne({_id : task.parentTask}) 
            await task.save()
            parentTask.replies = parentTask.replies.concat(task._id)
            await parentTask.save()
            await User_related_Tasks.insertTask(req.user._id, task.parentTask)
               
        }else{
        //User_related_Tasks
            await task.save()
            await User_related_Tasks.insertTask(req.user._id, task._id)
        }
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
    
    related_task = []
    //grab all tasks where I am owner
    // grab all where I am assignee
    //grab all where I am in replies assignee
    const tasks = await User_related_Tasks.find({userId :  req.user._id})
    try{
        const tasks = await User_related_Tasks.find({userId :  req.user._id})
        

        res.status(200).send(tasks)
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
        
        const replies = await Task.find({ _id : { $in : task.replies}}) 
        const complete_task_data = {
           task : task._doc,
            replies
        }
        res.status(200).send(complete_task_data)
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
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
        
        if(!task){
            res.status(404).send("Task Not Found")
        }
        await Task.deleteMany({ _id : { $in : task.replies}}) 
        await task.remove();
        //await user_related_Tasks_Schema.deleteTask( task_id)
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//assignee code 
router.post("/task/assignee", auth, async(req, res)=>{
    
    //asssumung that req body is going to have userId, user_name, parent
    console.log(req.body)
    const assignee = {
        userId : req.body.userId,
       name : req.body.name
    }
    
    try{
        const parentTask = await Task.findOne({_id : req.body.parent}) 
        if(parentTask){
            
            parentTask.assignees = parentTask.assignees.concat(assignee)
            await parentTask.save()
            if(parentTask.type == "T"){
                await User_related_Tasks.insertTask(req.body.userId, parentTask._id)
            }else{
                await User_related_Tasks.insertTask(req.body.userId, parentTask.parentTask)
            }
            res.status(201).send(assignee)
        }else{
            res.status(400).send(assignee)
        }
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
    
})

//delete assignee
router.delete("/task/:taskId/assigneee/:assigneeId",auth, async (req, res)=>{
    try{
        const task = await Task.findOne({_id : req.params.taskId,  owner : req.user._id}) 
        
        if(!task){
            res.status(404).send("Task Not Found")
        }
        
        task.assignees = task.assignees.filter((item)=>{
    
            return item._id != req.params.assigneeId
        })
        
        await task.save();
        res.status(200).send(task.assignees)

    }catch(e){
        res.status(500).send(e)
    }
})

//get all assignee for particular task
router.get("/task/:taskId/assigneee", auth,async (req, res)=>{
    
    try{
        const task = await Task.findOne({_id : req.params.taskId,  owner : req.user._id}) 
        
        res.status(200).send(task.assignees)
    }catch(e){
        res.status(500).send(e)
    }
}) 


module.exports = router

