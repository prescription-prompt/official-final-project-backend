const mongoose = require('mongoose');
const request = require('supertest');
const testData = require('../db/data/test-data/index.js');
const app = require('../app');
const seed = require('../db/seed/seed');

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

// afterEach(async () => {
//   await removeAllCollections();
// });

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
});
