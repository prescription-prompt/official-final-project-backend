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
    test('Returns 400 status code if required body field is missing', async () => {
      const newUser = {
        lastName: 'McTestface',
        password: 'testpassword',
        email: 'testymctestface@gmail.com',
      };
      const { body } = await request(app)
        .post(`/api/users/`)
        .send(newUser)
        .expect(400);
      expect(body.errors).toEqual({ firstName: 'Please input first name' });
    });
    test('Returns 400 status code if required body field is invalid', async () => {
      const newUser = {
        firstName: 'Testy',
        lastName: 'McTestface',
        password: 'testpassword',
        email: 'testymctestface@gmail',
      };
      const { body } = await request(app)
        .post(`/api/users/`)
        .send(newUser)
        .expect(400);
      expect(body.errors).toEqual({
        email: 'Path `email` is invalid (testymctestface@gmail).',
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

describe('PRESCRIPTION TESTS', () => {
  describe('GET /prescriptions/:userId', () => {
    test('Returns 200 status code and array of all prescriptions for the user with provided id', async () => {
      const res = await request(app)
        .get('/api/prescriptions/627380e26aeedd08eac2e80c')
        .expect(200);
      expect(res.body.prescriptions).toBeInstanceOf(Array);
      expect(res.body.prescriptions.length).toBe(3);
      res.body.prescriptions.forEach((prescription) => {
        expect(prescription).toMatchObject({
          _id: expect.any(String),
          name: expect.any(String),
          frequency: expect.any(Number),
          dosage: expect.any(String),
          amount: expect.any(Number),
          firstPromptTime: expect.any(Number),
          userId: '627380e26aeedd08eac2e80c',
          notes: expect.any(String),
        });
      });
    });
    test('Returns 200 status code and an empty array if no prescriptions found in the database for the user with valid id', async () => {
      const res = await request(app)
        .get('/api/prescriptions/627381db9be1122140b91fbc')
        .expect(200);
      expect(res.body.prescriptions).toBeInstanceOf(Array);
      expect(res.body.prescriptions.length).toBe(0);
    });
    test('Returns 400 status code if userId is not valid', async () => {
      const { body } = await request(app)
        .get(`/api/prescriptions/notValidId15`)
        .expect(400);

      expect(body.msg).toEqual('Invalid request');
    });

    test('Returns 404 status code if userId not in the database', async () => {
      const { body } = await request(app)
        .get(`/api/prescriptions/6274368fa87c3f460c56a251`)
        .expect(404);

      expect(body.msg).toEqual(
        `No user with userId 6274368fa87c3f460c56a251 found in the database`
      );
    });
  });

  describe('POST /api/prescriptions/', () => {
    test('Returns 201 status code and the posted prescription', async () => {
      const newPrescription = {
        name: 'Hydrochlorothiazide',
        dosage: '25mg',
        frequency: 86400,
        firstPromptTime: 1651827,
        notes: 'avoid alcohol',
        userId: '627381e77acbb4cacbaeb67d',
        amount: 32,
      };
      const { body } = await request(app)
        .post(`/api/prescriptions/`)
        .send(newPrescription)
        .expect(201);
      expect(body.prescription).toMatchObject({
        _id: expect.any(String),
        name: 'Hydrochlorothiazide',
        dosage: '25mg',
        frequency: 86400,
        firstPromptTime: 1651827,
        notes: 'avoid alcohol',
        userId: '627381e77acbb4cacbaeb67d',
        amount: 32,
      });
    });
    test('Returns 400 status code if required body field is missing', async () => {
      const newPrescription = {
        frequency: 86400,
        firstPromptTime: 1651827,
        notes: 'avoid alcohol',
        userId: '627381e77acbb4cacbaeb67d',
        amount: 32,
      };
      const { body } = await request(app)
        .post(`/api/prescriptions/`)
        .send(newPrescription)
        .expect(400);
      expect(body.errors).toEqual({
        dosage: 'Please input dosage',
        name: 'Please input medication name',
      });
    });
    test('Returns 400 status code if required body field is invalid', async () => {
      const newPrescription = {
        name: 'Hydrochlorothiazide',
        dosage: '25mg',
        frequency: 86400,
        firstPromptTime: 1651827,
        notes: 'avoid alcohol',
        userId: '627381e77acbb4cacbaeb67d',
        amount: 'twenty-eight',
      };
      const { body } = await request(app)
        .post(`/api/prescriptions/`)
        .send(newPrescription)
        .expect(400);
      expect(body.errors).toEqual({
        amount:
          'Cast to Number failed for value "twenty-eight" (type string) at path "amount"',
      });
    });
  });
});
