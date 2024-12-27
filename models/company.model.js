module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define('Company', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    symbol: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    stockValue: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    industry: {
      type: Sequelize.STRING,
    },
    marketCap: {
      type: Sequelize.BIGINT,
    },
    ceo: {
      type: Sequelize.STRING,
    },
    headquarters: {
      type: Sequelize.STRING,
    },
  });

  return Company;
};
