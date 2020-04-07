const mongoose = require("mongoose")

const user_related_Tasks_Schema  = new mongoose.Schema({
   
   userId : {
      type : mongoose.Schema.Types.ObjectId,
      required : true 
   },
   tasks:[mongoose.Schema.Types.ObjectId]
  
 
  }, {
     timestamps : true
  })

  user_related_Tasks_Schema.statics.insertTask = async (userId, taskId)=>{
    const user = await User_related_Tasks.findOne({userId : userId})
    if(!user){
        const new_user = new User_related_Tasks({
            userId : userId,
            tasks : [taskId]
        }) 
        await new_user.save();
    }else{
        
        
        const match=user.tasks.filter((item)=>{
            
            return item.toString() == taskId.toString()
        })
        console.log(match)
        const match_not_found = match.length == 0?true:false;
        if(match_not_found){
            
            user.tasks = user.tasks.concat(taskId)
            await user.save()
        }
    }
  }

const User_related_Tasks = mongoose.model('user_related_Tasks', user_related_Tasks_Schema);

module.exports = User_related_Tasks

