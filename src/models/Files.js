const mongoose = require("mongoose")

const fileSchema  = new mongoose.Schema({
   extension: {
      type : String,
      required : true,
      trim : true  
   },
   ownerUser : {
      type : mongoose.Schema.Types.ObjectId,
      required : true 
   },
   ownerTask : {
    type : mongoose.Schema.Types.ObjectId,
    required : true 
 },
  }, {
     timestamps : true
  })

const File = mongoose.model('File', fileSchema);

module.exports = File

