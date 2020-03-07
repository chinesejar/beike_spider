module.exports = (sequelize, DataTypes) =>
  sequelize.define('community', {
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
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    building_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    property_cost: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    property_manager: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    developer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    building_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    house_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    biz_circle: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    indexes: [
      {
        unique: true,
        fields: ['name', 'biz_circle']
      }
    ]
  })