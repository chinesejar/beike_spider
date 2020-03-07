const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_URI, {
  logging: false,
  pool: true,
  dialect: 'mysql'
});

const City = sequelize.import(__dirname + '/city');
const District = sequelize.import(__dirname + '/district');
const BizCircle = sequelize.import(__dirname + '/biz_circle');
const Community = sequelize.import(__dirname + '/community');


sequelize.sync();

module.exports = {
  sequelize,
  City, District, BizCircle, Community
}
