module.exports = (sequelize, DataTypes) =>
  sequelize.define('district', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    href: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, {
    charset: 'utf8'
  })