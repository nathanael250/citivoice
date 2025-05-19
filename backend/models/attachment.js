'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Attachment belongs to a User (uploader)
      Attachment.belongsTo(models.User, {
        foreignKey: 'uploadedById',
        as: 'uploader'
      });
      
      // Polymorphic associations - Attachment can belong to different types of entities
      // These are "pseudo-associations" since Sequelize doesn't directly support polymorphic relations
      
      // You can add helper methods to make working with the polymorphic relationship easier
      Attachment.addHook('afterFind', findResult => {
        if (!findResult) return;
        
        const results = Array.isArray(findResult) ? findResult : [findResult];
        
        for (const instance of results) {
          if (instance.relatedType === 'complaint' && instance.relatedId) {
            // This is a method that will be available on Attachment instances
            instance.getRelated = function(models) {
              return models.Complaint.findByPk(this.relatedId);
            };
          } else if (instance.relatedType === 'response' && instance.relatedId) {
            instance.getRelated = function(models) {
              return models.Response.findByPk(this.relatedId);
            };
          }
        }
      });
    }
  }
  
  Attachment.init({
    fileName: DataTypes.STRING,
    fileType: DataTypes.STRING,
    fileSize: DataTypes.INTEGER,
    filePath: DataTypes.STRING,
    uploadedById: DataTypes.INTEGER,
    relatedType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['complaint', 'response']] // Restrict to valid related types
      }
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attachment',
    indexes: [
      // Add an index for the polymorphic relationship
      {
        fields: ['relatedType', 'relatedId']
      }
    ]
  });
  
  return Attachment;
};
