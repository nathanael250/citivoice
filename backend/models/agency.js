'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Agency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Agency belongs to a User (administrator)
      Agency.belongsTo(models.User, {
        foreignKey: 'administratorId',
        as: 'administrator'
      });
      
      // Agency has many Complaints (assigned to this agency)
      Agency.hasMany(models.Complaint, {
        foreignKey: 'assignedToId',
        as: 'assignedComplaints'
      });
    }
  }
  
  Agency.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    department: DataTypes.STRING,
    contactEmail: DataTypes.STRING,
    contactPhone: DataTypes.STRING,
    address: DataTypes.TEXT,
    jurisdiction: DataTypes.STRING,
    administratorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Agency',
  });
  
  return Agency;
};
