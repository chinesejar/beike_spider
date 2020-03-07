module.exports = (sequelize, DataTypes) =>
  sequelize.define('biz_circle', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    href: {
      type: DataTypes.STRING,
      allowNull: false
    },
    district: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    indexes: [
      {
        unique: true,
        fields: ['name', 'district']
      }
    ]
  })