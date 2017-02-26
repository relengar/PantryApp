var express = require('express');
    morgan = require('morgan');
    async = require('async');
    db = require('./db');

var bodyParser = require('body-parser')
var _port = 8080;
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/pantryFront"));


app.get('/snacks.json', function(req, res) {
  var snacksFromDB = db.snack.findAll()
  .then(function(dbSnacks){
    return send_success_resp(res, dbSnacks);
  });
});

app.get('/users.json', function(req, res) {
  var usersFromDB = db.user.findAll()
  .then(function(dbUsers){
    return send_success_resp(res, dbUsers);
  });
});

app.get('/snacks/:id.json', function(req, res){
  req.param;
  var snack = db.snack.findOne({where : {snack_id : req.param}})
  .then(function(result) {
    return send_success_resp(res, result);
  });
});


app.put('/snacks/submit.json', function(req, res) {
  db.snack.update({count:(req.body.snack.count -1)}, {where:{id:req.body.snack.id}})
  .then(function(){
    var snack = db.snack.findById(req.body.snack.id)
    .then(function(snack){
      var userSnacks = updateUserSnacks(req.body.user.snacks, snack.dataValues);
      db.user.update({snacks: userSnacks}, {where:{id:req.body.user.id}})
      .then(function(){
        var user = db.user.findById(req.body.user.id)
        .then(function(user){
          send_success_resp(res, {"snack": snack, "user": user});
        });
      });
    });
  });
});

function updateUserSnacks(userSnacks, userSnack) {
  var result = [];
  for (var i = 0; i < userSnacks.length; i++) {
    var temp = userSnacks[i];
    if (temp.id == userSnack.id) {
      temp.count ++;
      userSnacks[i] = JSON.stringify(temp);
      return userSnacks;
    }
    else {
      result.push(JSON.stringify(userSnacks[i]));
    }
  }
  result.push(JSON.stringify({"name":userSnack.name, "count":1, "id":userSnack.id}));
  return result;
}



function send_error_resp() {
  var resp, http_status, code, message;
  if (arguments.length == 4) {
    resp = arguments[0];
    http_status = arguments[1];
    code = arguments[2];
    message = arguments[3];
  }
  else if (arguments.length == 3) {
    resp = arguments[0];
    http_status = arguments[1];
    code = arguments[2].error;
    message = arguments[2].message;
  }
  else if (arguments.length == 2) {
    resp = arguments[0];
    http_status = _http_code_from_error(arguments[1].error);
    code = arguments[1].error;
    message = arguments[1].message;
  }
  else {
    console.error("send_error_resp: Something is wrong");
    throw new Error("send_error_resp called wrongly");
  }

  res.setHeader('content-type', 'application/json');
  res.status(http_status).send(JSON.stringify({error: code, message: message}))
  res.end();
}

function send_success_resp(res, obj) {
  if (arguments.length != 2) {
    console.error("send_success_resp: There is a problem");
    throw new Error();
  }
  res.setHeader('content-type', 'application/json');
  res.status(200).send(JSON.stringify(obj));
  res.end();
}

function _http_code_from_error(error_code) {
  switch (error_code) {

    default:
      return 503;
  }
}

console.error('starting server');
app.listen(_port);
