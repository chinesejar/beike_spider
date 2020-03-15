module.exports = (sequelize, DataTypes) =>
  sequelize.define('province', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    abbr: {
      type: DataTypes.STRING(1),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    }
  }, {
    charset: 'utf8'
  })