const mongoose = require("mongoose")

const taskSchema  = new mongoose.Schema({
   title: {
      type : String,
      required : true,
      trim : true  
   } ,
   descrption: {
      type : String,
      required : true,
      trim : true  
   } ,
   files : [String],
   assignees : [{
      userId : {
          type : String,
          required : true
      },
      name :{
         type : String,
         required : true
     } 
   }],
   replies : [String],
   completed :{
      type : Boolean, 
      default : false  
      
   } ,
   parentTask : {
      //Parent Task Id for replies, for tasks it will null. 
      type : mongoose.Schema.Types.ObjectId,
   },
   owner : {
      type : mongoose.Schema.Types.ObjectId,
      required : true ,
      ref : 'User'
   },
   type: {
      // T = TASK, R=REPLY
      type : String,
      required : true
   }
  }, {
     timestamps : true
  })


// taskSchema.virtual('replies', {
//    ref : 'Reply',
//    localField : '_id',
//    foreignField :  'parentTask'
// })


const Task = mongoose.model('Task', taskSchema);

module.exports = Task

