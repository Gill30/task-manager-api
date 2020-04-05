const mongoose = require("mongoose")

const replySchema  = new mongoose.Schema({
   title: {
      type : String,
      required : true,
      trim : true  
   } ,
   descrption: {
      type : String,
      required : true,
      trim : true  
   },
   owner : {
      type : mongoose.Schema.Types.ObjectId,
      required : true ,
      ref : 'User'
   },
   parentTask : {
    type : mongoose.Schema.Types.ObjectId,
    required : true ,
    ref : 'Task'
 }
  }, {
     timestamps : true
  })

 
 const Reply = mongoose.model('Reply', replySchema);

module.exports = Task

