var mongoose = require("mongoose");
var ProblemSchema = mongoose.Schema({
  id : Number,
  name : String,
  des : String,
  difficulty : String
});

var problemModel = mongoose.model("ProblemModel", ProblemSchema);

module.exports = problemModel
