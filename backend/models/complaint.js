'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Complaint.belongsTo(models.User, {
        foreignKey: 'submittedById',
        as: 'submitter'
      });
      Complaint.belongsTo(models.Agency, {
        foreignKey: 'assignedToId',
        as: 'assignedAgency'
      });
      Complaint.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
      Complaint.hasMany(models.Response, {
        foreignKey: 'complaintId',
        as: 'responses'
      });
      Complaint.hasMany(models.Attachment, {
        foreignKey: 'relatedId',
        scope: {
          relatedType: 'complaint'
        },
        as: 'attachments'
      });
      Complaint.hasMany(models.Notification, {
        foreignKey: 'complaintId',
        as: 'notifications'
      });
    }
  }
  Complaint.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER,
    status: DataTypes.ENUM('submitted', 'in-review', 'assigned', 'in-progress', 'resolved', 'closed'),
    priority: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    location: DataTypes.TEXT,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    submittedById: DataTypes.INTEGER,
    assignedToId: DataTypes.INTEGER,
    resolutionDate: DataTypes.DATE,
    resolutionDetails: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Complaint',
  });
  return Complaint;
};