const initalData = [
  {"name" : "Dude", "snacks" : []},
  {"name" : "Other Dude", "snacks" : []},
  {"name" : "Girl", "snacks" : []},
  {"name" : "Yet another dude", "snacks" : []}
];

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    name: {
      type: Sequelize.STRING,
      field: 'name'
    },
    snacks: {
      type: Sequelize.ARRAY(Sequelize.TEXT)
    }
  },
  {
    freezeTableName: true
  });

  User.sync({force: true}).then(() => {
    for (let i = 0; i < initalData.length; i++) {
      User.create({
        name: initalData[i].name,
        snacks: initalData[i].snacks
      });
    }
  });

  return User;
};
