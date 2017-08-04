const initalData = [
{'name': 'Snickers', 'count':20},
{'name': 'Leguan na spajli', 'count':20},
{'name': 'Udon', 'count':20},
{'name':'Kari', 'count':20},
{'name':'Caj', 'count':20}
];

module.exports = (sequelize, Sequelize) => {
  const Snack = sequelize.define('snack', {
    name: {
      type: Sequelize.STRING,
      field: 'name'
    },
    count: {
      type: Sequelize.INTEGER
    }
  },
  {
    freezeTableName: true
  });

  Snack.sync({force: true}).then(() => {
    for (let i = 0; i < initalData.length; i++) {
      Snack.create({
        name: initalData[i].name,
        count: initalData[i].count
      });
    }
  });

  return Snack;
};
