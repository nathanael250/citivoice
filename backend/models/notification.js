'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Notification belongs to a User (recipient)
      Notification.belongsTo(models.User, {
        foreignKey: 'recipientId',  // This should match the column name in your model
        as: 'recipient'  // This is the alias for the association
      });
      
      // Notification belongs to a Complaint
      Notification.belongsTo(models.Complaint, {  // Fixed typo: Model.Complaint → models.Complaint
        foreignKey: 'complaintId',  // This should match the column name in your model
        as: 'complaint'  // This is the alias for the association
      });
    }
  }
  
  Notification.init({
    type: {
      type: DataTypes.ENUM('email', 'in-app', 'SMS'),
      allowNull: false,
      defaultValue: 'in-app'
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Complaints',
        key: 'id'
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    actionRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  
  return Notification;
};
