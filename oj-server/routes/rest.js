var express = require("express");
var router = express.Router();
var problemsService = require("../services/problemService");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.get("/problems", function(req, res){
  problemsService.getProblems()
                  .then(problems => res.json(problems));
});

router.get("/problems/:id", function(req,res){
    var id = req.params.id;
    problemsService.getProblem(+id)
                    .then( problem => res.json(problem));
});

router.post("/problems", jsonParser,function(req,res){
  problemsService.addProblem(req.body)
                  .then(function(problem){
                    res.json(problem);
                  },function(error){
                    res.status(400).send(error);
                  })
  }
);


module.exports = router;
