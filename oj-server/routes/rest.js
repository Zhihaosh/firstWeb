var express = require("express");
var router = express.Router();
var problemsService = require("../services/problemService");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var node_rest_client = require('node-rest-client').Client;
var rest_client = new node_rest_client();

EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run'

rest_client.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');


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
  })
  router.post("/build_and_run", jsonParser,function(req,res){
    const userCode = req.body.user_code;
    const lang = req.body.lang;
    rest_client.methods.build_and_run({
      data: { code: userCode, lang: lang},
      headers:{"Content-Type": "application/json"}
    },(data, response) =>{
      console.log(response);
      const build = `Build output:${data['build']};`
      const execute = `Execute output: ${data['run']} ;`
      data['build'] = build;
      data['execute'] = execute;
      res.json(data);
    }
  )
  }
);


module.exports = router;
