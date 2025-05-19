'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      User.hasMany(models.Complaint, {
        foreignKey: 'submittedById',
        as: 'submittedComplaints'
      });
      
      User.hasMany(models.Response, {
        foreignKey: 'respondedById',  // Note: fixed typo from 'responseById'
        as: 'responses'
      });
      
      User.hasMany(models.Notification, {
        foreignKey: 'recipientId',
        as: 'notifications'
      });
      
      User.hasMany(models.Attachment, {
        foreignKey: 'uploadedById',
        as: 'uploads'
      });
      
      User.hasOne(models.Agency, {
        foreignKey: 'administratorId',
        as: 'administeredAgency'
      });
    }
  }
  
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: DataTypes.STRING,
    address: DataTypes.TEXT,
    role: {
      type: DataTypes.ENUM('citizen', 'official', 'admin'),
      defaultValue: 'citizen'
    },
    profilePicture: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'inactive'),
      defaultValue: 'active'
    },
    lastLogin: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  
  return User;
};
