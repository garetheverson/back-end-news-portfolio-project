const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const app = require('../app');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
  test('200: Responds with: an array of topic objects, each of which should have the following properties: slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics.length).toBe(3);
        res.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  describe('GET /api/[unrecognised path]', () => {
    test('404: responds with "Route note found" for an unrecognised GET path', () => {
      return request(app)
        .get('/api/blahblahblah')
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe('Route not found');
        });
    });
  });
});
