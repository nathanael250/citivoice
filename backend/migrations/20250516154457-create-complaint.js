'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Complaints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      categoryId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('submitted', 'in-review', 'assigned', 'in-progress', 'resolved', 'closed')
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium','high', 'urgent'),
        defaultValue: 'medium'
      },
      location: {
        type: Sequelize.TEXT
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      submittedById: {
        type: Sequelize.INTEGER
      },
      assignedToId: {
        type: Sequelize.INTEGER
      },
      resolutionDate: {
        type: Sequelize.DATE
      },
      resolutionDetails: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Complaints');
  }
};