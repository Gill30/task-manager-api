const express = require('express')
const Assignee = require("../models/Assignees")
const auth  =require("../middleware/auth")
const router = new express.Router()



router.post("/assignee", auth, async(req, res)=>{
    //const task = new Task(req.body)
    //asssumung that req body is going to have parent, user, type, status, parnetType
    console.log(req.body)
    const assignee = new Assignee({
        ...req.body,
        owner : req.user._id
    })
    try{
        await assignee.save()
        res.status(201).send(assignee)
    }catch(e){
        res.status(400).send(e)
    }
    
})


router.delete("/assigneee/:id",auth, async (req, res)=>{
    try{
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id : req.params.id, ownerUser : req.user._id})
        
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

