'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Feedback belongs to a Complaint
      Feedback.belongsTo(models.Complaint, {
        foreignKey: 'complaintId',
        as: 'complaint'
      });
      
      // Feedback belongs to a User (who submitted it)
      Feedback.belongsTo(models.User, {
        foreignKey: 'submittedById',
        as: 'submitter'
      });
    }
  }
  
  Feedback.init({
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comments: DataTypes.TEXT,
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Complaints',
        key: 'id'
      }
    },
    submittedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Feedback',
    indexes: [
      // Ensure a user can only provide one feedback per complaint
      {
        unique: true,
        fields: ['complaintId', 'submittedById']
      }
    ]
  });
  
  return Feedback;
};
