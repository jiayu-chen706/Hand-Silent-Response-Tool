'use strict';

const teacher = require('../models/teacher');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('teachers', [
      {
        name: 'Mizuki',
        username: 'mizuki',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Izumik',
        username: 'i1lI',
        password: 'asdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
    await queryInterface.bulkInsert('courses', [
      {
        name: 'biology',
        createdAt: new Date(),
        updatedAt: new Date(),
        teacherId: 1
      },
      {
        name: 'calculus',
        createdAt: new Date(),
        updatedAt: new Date(),
        teacherId: 1
      },
      {
        name: 'empty course',
        createdAt: new Date(),
        updatedAt: new Date(),
        teacherId: 1
      }
    ]);
    await queryInterface.bulkInsert('classes', [
      {
        name: 'Week 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        courseId: 1,
        inviteCode: 'K8L3ZQ',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyAQAAAADAX2ykAAAClklEQVR4nO2bS4qkQBCGvxiFWqZQB+ij6M2Gvpl5lDpAgblsSPlnkWm1PdMzNQ22KESsfHyLH4J4ZISa+IrFH1/CwXnnnXfeeeed/xtv1dp6NaSWcjuk5d2wox7nN+Z7SdIEGpc3GsObaaSRJOkj/916nN+YT48IDbm41gYa2QAlknfW4/w2fPvbvREaQboKkiHSvnqc/2a+v7UAswHNn4fjw+t3/lM+SLX0hrfiWhuKk0FS3luP85vy0czMOoB0KVWXh5PNzGxfPc5vxJf6u8rD8SVTmqzYYRA+5uij6Xf+iZXDTy+JfgJ6ZTTSCMLjVBQqovFo+p3/t636Z0Fuid0d+qkzlWfpmo20pOfD6Xf+f3i9drMR7SLpdhGxA7MObAi5TD921eP8VnyN3/52kfUCA0yEewvMLaQOYndf4vxo+p1/Ykv9zXU02U+gMWRq/Q2SpFw4r79n46t/Cbkecx+5uDhU0wJ6f3VqvhFxGTNLyqX+ErtGrCZZh9Xv/Oemj1bPQlNN0ktqzh6/5+R592rNxWVSWQNWo9ffU/OLf6GONlaRTPPwucfvqfkSoa/WAsmMaGbSBDYEif528fp7bj612E9lykCDIBG72arPy05pTz3Ob8OXjtmgyUa6ymLx5NyKcG8NZiN2k2wfPc5/B1/y81jKbMaG1ALpsl487KnH+a34R/wC0GSiNQLm1nrNBumaidYsC/6j6Xf+ib3vB6WpNszlanysFno/H52dX76fNHuprVV5Hs2M2O2ux/nv4euSoRThi+p8Y2qWb3aOrt/5J3w/AdFaVquF6N9fnZVf9rpBUL51Th30U1c2wUCbqevgPfQ4vy2/nk+ymjrnMnpefmfw/uqkvPn/3c4777zzzju/O/8LpEOsAaQZuZkAAAAASUVORK5CYII='
      },
      {
        name: 'Week 2',
        createdAt: new Date(),
        updatedAt: new Date(),
        courseId: 1,
        inviteCode: 'M4JP1B',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyAQAAAADAX2ykAAAChUlEQVR4nO2bS2rjQBCGvxoJtJRgDuCjtG4WfKS5gfooPkBAWhok/ll0txWHZJIwfkhQtXAU61sUNH+9umziJxZ//QgH55133nnnnXf+M96y1RDNjNiRnqyfyrv+gf44f2M+SJJGsL6dsZ7FCCMAlSRJ1/y9/XH+xvyUFaphaiSdGgGVNABJ2I/1x/k78WFczKxbSkB+tj/O35S3Pv2tpIHFnu6P87fhW6VYrONhRtLZiIcZ6wFJ86P9cf42fE6sMSm1wsKpkYU/v5WeeCfirfnv/L8tne86pFTsKhQPZyN2FdBeDzC35r/z3+Gtn+r0ASxmL6dGGtqz5beriLfpv/OfWmpuw1gppdmg+ZJwq6RdDa2UWuRha/47/30+WiOiNTLrKhFG0NDOEE7m+t0nn/XLqtBWuvpu1bTrd398ObdWksYckMtJ5yCdReznu0M+1c8G9WxhmCEMQOxGYGpUwnJVnrbmv/Pf4sO4mI5W0mw41djLmF+A18975S/5dyYl3DyarC4xOxdZnn93yZf+qDRJ5QN4e9Kef3fK5/lVNBCcTUyLiYmUiXNYXjPx1vx3/gtb9asBSPpN1w1tLqLL4MP1uz++6Ld7raEdIemXXFOTSuf2tYyot+a/819YmU9C6n/Tpo7WcouyveP63SGPrg3amTdDrFBO3+Pzjvl1f1LDVOf+18wMphriwe/3981f9ifTwDl2kONzO3/E39sf52/Ml/3JdAmcp1bkdejcDj/SH+fvw+t4kKynumTdmRSkn+OP8//H1+/+N7CypNON+ct4ED7f2CX/dr6hMS+0S5rRQJl0yO9/98qX+4VkVemPgLW08vnVfnnz33c777zzzjvv/MP5v7hv0EJUOdPGAAAAAElFTkSuQmCC'
      },
      {
        name: 'calculus 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        courseId: 2,
        inviteCode: 'V9R7XZ',
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyAQAAAADAX2ykAAACbUlEQVR4nO2bQYrjMBBFX40NvZRhDpCjyFfrI80NoqPkBvaywebPQpLjbqZpGhx3NJQWIY7foqAo6f9SxcR3Vvr1LRycd95555133vnPeCurB2YzmMsP9282nhiP8wfzUZI0AWnoRLosQJBspJMk6T3/6HicP5ifS4XaCBBvPdKtz+9KYZ8aj/MP49eSabu8ma4/H4/zh/JhgXSRpFuPjT8ej/NH8EHKtRqnTsRpNaDLp66k5ex4nD+UT2ZmNgDMPTC/yMb8aq1K+sx4nD+Iz8Jp16RMlzcTlA8I7xuYzxa/81+sbH7iBJC90JLtEoSF7JmoJknXZ4vf+S9WMbehZjVqoT4uAJ3qC89vezylMKdO5FxO3XultSGe32b54nVDMbw2hgVgNQgSaVhdXzXNx9uLYH5RfewhXRZKf2N78azxO//J2vTzAoQJi9cFFUW9kss2Cixez4jH+WP5qq/uR2+VVlJ91NX1c6t8EU9bBotWvkurqVNJt+e3QX7nj3ZluuW8uCKv31b52t+4V+g/mFzOnt8G+S2/qncJm/8laLdJe/22za9GlFQuGXJqV9NrnuR4c//bJr/rP5dec9CmpOtUTpzA9+cm+c3/CgjKhrfY4dkgXsHScFo8zj+Cv89P6spq5NYkUK6D2c7k54zf+U/XXV+VS4aw97+7OyXfn1vk62DkPED8AzBb3p+VLsKSAcy/vf/8n/Bx6gRzj42zZU2t12H1+fY2+f7jD2noKIYoTJDqOaxz4nH+MXworasso5L1SNNq5SY4+Pxko/x2fwTkgdiw9Z/DkkdjvX/VLm/+/27nnXfeeeedP53/C3hk2jv2ZSAtAAAAAElFTkSuQmCC'
      },
    ]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers', null, {});
    await queryInterface.sequelize.query('ALTER TABLE classes AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE courses AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('ALTER TABLE teachers AUTO_INCREMENT = 1');
  }
};
