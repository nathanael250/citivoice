'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Response belongs to a Complaint
      Response.belongsTo(models.Complaint, {
        foreignKey: 'complaintId',
        as: 'complaint'
      });
      
      // Response belongs to a User (who responded)
      Response.belongsTo(models.User, {
        foreignKey: 'respondedById',
        as: 'responder'
      });
      
      // Response has many Attachments
      Response.hasMany(models.Attachment, {
        foreignKey: 'relatedId',
        scope: {
          relatedType: 'response'
        },
        as: 'attachments'
      });
    }
  }
  
  Response.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    complaintId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Complaints',
        key: 'id'
      }
    },
    respondedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    internalNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Response',
  });
  
  return Response;
};
