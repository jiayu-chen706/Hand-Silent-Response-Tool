'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [
      {
        name: 'John',
        studentID: 'jjj',
        classId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Amiya',
        studentID: 'AAA',
        classId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Banana',
        studentID: 'nananana',
        classId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    await queryInterface.bulkInsert('responses', [
      {
        studentId: 1,
        classId: 1,
        isAnonymous: true,
        text: "Hello",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 1,
        classId: 2,
        "isAnonymous": false,
        text: "Hi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        classId: 1,
        isAnonymous: false,
        text: "😀",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        classId: 2,
        isAnonymous: true,
        text: "🥕",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        classId: 3,
        isAnonymous: false,
        text: "not biology",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('feedbacks', [
      {
        responseId: 1,
        content: "nice",
        type: "text",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('feedbacks', null, {});
    await queryInterface.bulkDelete('responses', null, {});
    await queryInterface.bulkDelete('students', null, {});
    await queryInterface.sequelize.query('ALTER TABLE feedbacks AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE responses AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE students AUTO_INCREMENT = 1');
  }
};
