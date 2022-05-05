const mongoose = require('mongoose');
const request = require('supertest');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');
const seed = require('../db/seed/seed');
const { getMaxListeners } = require('../app');

// let data;

beforeEach(async () => {
  await seed(testData)
    .then((savedData) => (data = savedData))
    .catch((err) => console.log(err));
});

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections);
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName];
    await collection.deleteMany();
  }
}

afterEach(async () => {
  await removeAllCollections();
});

afterAll(async () => {
  // Closes the Mongoose connection
  await mongoose.connection.close();
});

describe('USERS TESTS', () => {
  describe('GET /api/users', () => {
    test('Returns 200 status code and array of all users', async () => {
      const res = await request(app).get('/api/users').expect(200);
      expect(res.body.users).toBeInstanceOf(Array);
      expect(res.body.users.length).toBe(10);
      res.body.users.forEach((user) => {
        expect(user).toMatchObject({
          _id: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          password: expect.any(String),
          email: expect.any(String),
        });
      });
    });
  });

  describe('POST /api/users/', () => {
    test('Returns 201 status code and the posted user', async () => {
      const newUser = {
        firstName: 'Testy',
        lastName: 'McTestface',
        password: 'testpassword',
        email: 'testymctestface@gmail.com',
      };
      const { body } = await request(app)
        .post(`/api/users/`)
        .send(newUser)
        .expect(201);
      expect(body.user).toMatchObject({
        _id: expect.any(String),
        firstName: 'Testy',
        lastName: 'McTestface',
        password: 'testpassword',
        email: 'testymctestface@gmail.com',
      });
    });
  });

  describe('GET /api/users/:email', () => {
    test('Returns 200 status code and user object with matching email', async () => {
      const { body } = await request(app)
        .get('/api/users/vehicula@yahoo.couk')
        .expect(200);

      expect(body.user).toMatchObject({
        _id: '6273815350ef46c073791a82',
        firstName: 'Conan',
        lastName: 'Christian',
        password: 'WRS65XLZ3RY',
        email: 'vehicula@yahoo.couk',
      });
    });

    test('Returns 400 status code if email is not valid', async () => {
      const { body } = await request(app)
        .get(`/api/users/notavalidemail@comm`)
        .expect(400);

      expect(body.msg).toEqual('Invalid request');
    });

    test('Returns 404 status code if email not in the database', async () => {
      const { body } = await request(app)
        .get(`/api/users/emailnotinthedb@gmail.com`)
        .expect(404);

      expect(body.msg).toEqual(
        'No user with emailnotinthedb@gmail.com found in the database'
      );
    });
  });
});
