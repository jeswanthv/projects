const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema(
  {
    name:{
      type:String,
      required:true
    }
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
