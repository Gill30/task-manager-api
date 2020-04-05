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
   assignees : [String],
   replies : [String],
   completed :{
      type : Boolean, 
      default : false  
      
   } ,
   owner : {
      type : mongoose.Schema.Types.ObjectId,
      required : true ,
      ref : 'User'
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

