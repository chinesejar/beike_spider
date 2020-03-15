module.exports = (sequelize, DataTypes) =>
  sequelize.define('city', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    abbr: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    href: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    charset: 'utf8'
  })