const AssigneeModel = require("../models/Assignees")

const assigneeService = function(){
    
    this.save = (assignee)=>{
        const assignee = new AssigneeModel({
            ...req.body,
            owner : req.user._id
        })
        await AssigneeModel.save();
    }
}