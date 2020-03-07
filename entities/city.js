module.exports = (sequelize, DataTypes) =>
  sequelize.define('city', {
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
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    href: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })