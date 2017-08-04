module.exports = (app) => {
  app.get('/snacks', (req, res) => {
    let snacksFromDB = db.snack.findAll()
    .then((dbSnacks) =>{
      return send_success_resp(res, dbSnacks);
    });
  });

  app.get('/users', (req, res) => {
    let usersFromDB = db.user.findAll()
    .then((dbUsers) =>{
      return send_success_resp(res, dbUsers);
    });
  });

  app.get('/snacks/:id', (req, res) => {
    req.param;
    let snack = db.snack.findOne({where : {snack_id : req.param}})
    .then((result) => {
      return send_success_resp(res, result);
    });
  });


  app.put('/snacks/submit.json', (req, res) => {
    db.snack.update({count:(req.body.snack.count -1)}, {where:{id:req.body.snack.id}})
    .then(() =>{
      let snack = db.snack.findById(req.body.snack.id)
      .then((snack) =>{
        let userSnacks = updateUserSnacks(req.body.user.snacks, snack.dataValues);
        db.user.update({snacks: userSnacks}, {where:{id:req.body.user.id}})
        .then(() =>{
          let user = db.user.findById(req.body.user.id)
          .then((user) =>{
            send_success_resp(res, {"snack": snack, "user": user});
          });
        });
      });
    });
  });

};


// helper functions

updateUserSnacks = (userSnacks, userSnack) => {
  let result = [];
  for (let i = 0; i < userSnacks.length; i++) {
    let temp = userSnacks[i];
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

send_success_resp = (res, obj) => {
  res.setHeader('content-type', 'application/json');
  res.status(200).send(JSON.stringify(obj));
  res.end();
}
