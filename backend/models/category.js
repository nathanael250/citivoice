'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category has many Complaints
      Category.hasMany(models.Complaint, {
        foreignKey: 'categoryId',
        as: 'complaints'
      });
      
      // Category belongs to an Agency (default agency)
      Category.belongsTo(models.Agency, {
        foreignKey: 'defaultAgencyId',
        as: 'defaultAgency'
      });
    }
  }
  
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    defaultAgencyId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Agencies',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  
  return Category;
};
