const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_URI, {
  logging: false,
  pool: true,
  dialect: 'mysql'
});

const Community = sequelize.import(__dirname + '/community');
const BizCircle = sequelize.import(__dirname + '/biz_circle');
const District = sequelize.import(__dirname + '/district');
const City = sequelize.import(__dirname + '/city');
const Province = sequelize.import(__dirname + '/province');

Community.belongsTo(BizCircle);
BizCircle.belongsTo(District);
District.belongsTo(City);
City.belongsTo(Province);

sequelize.sync();

module.exports = {
  sequelize, Province,
  City, District, BizCircle, Community
}
