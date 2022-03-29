const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('Errors: GET requests for topics: /api/topics', () => {
  it('404: "Path not found" for an unrecognised Topic GET path', () => {
    return request(app)
      .get('/api/blahblahblah')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Path not found');
      });
  });
});
describe('Errors: GET requests for articles: /api/articles/:article_id', () => {
  it('404: "Article not found" for an unrecognised article GET path', () => {
    return request(app)
      .get('/api/articles/1234567890')
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Article not found');
      });
  });
  it('400: Invalid data type', () => {
    return request(app)
      .get('/api/articles/not_an_id')
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Invalid Data Type');
      });
  });
});

describe('Success path: GET requests for topics: /api/topics', () => {
  it('200: Responds with array of topic objects, including slug and description', () => {
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
});
describe('Success path: GET requests for articles: /api/articles/:article_id', () => {
  it('200: Responds with a given article that matches the ID of the params', () => {
    const identifier = 3;
    return request(app)
      .get(`/api/articles/${identifier}`)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual({
          article_id: identifier,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 0,
        });
      });
  });
});

describe('Success path: GET requests for users: /api/users', () => {
  it('200: Responds with array of user objects, including just username', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((res) => {
        expect(res.body.users).toBeInstanceOf(Array);
        expect(res.body.users.length).toBe(4);
        res.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
          });
        });
        expect(res.body.users[0]).toEqual({
          username: 'butter_bridge',
        });
        expect(res.body.users[3]).toEqual({
          username: 'lurker',
        });
      });
  });
});
