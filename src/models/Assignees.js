const mongoose = require("mongoose")

const assigneeSchema  = new mongoose.Schema({
   status: {
      type : String,
      required : true,
      trim : true  
   },
   type: {
    type : String,
    required : true
 },
   user : {
      type : mongoose.Schema.Types.ObjectId,
      required : true
   }, 
   owner : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
 },
   parnet : {
    type : mongoose.Schema.Types.ObjectId,
    required : true 
 },
 parentType: {
    // T = TASK, R=REPLY
    type : String,
    required : true
 },
  }, {
     timestamps : true
  })

  assigneeSchema.methods.toJSON= function(){
    const assignee = this
    const assigneeObject = assignee.toObject()
    delete assigneeObject.owner

    return assigneeObject
}

const Assignee = mongoose.model('Assignee', assigneeSchema);

module.exports = Assignee

