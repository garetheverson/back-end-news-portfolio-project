const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

afterAll(() => db.end());
beforeEach(() => seed(testData));

// ERROR PATHS
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

describe('Errors: Invalid PATCH requests: vote increment / decrements via /api/articles/:article_id ', () => {
  it("404: Responds with 'Article not found' if article relating to vote increment / decrements doesn't exist", () => {
    return request(app)
      .patch(`/api/articles/1234567890`)
      .send({ inc_votes: 4 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Article not found');
      });
  });
  it("400: Responds with 'Missing valid inc_votes' if votes not provided, ", () => {
    const identifier = 3;
    return request(app)
      .patch(`/api/articles/${identifier}`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Missing valid inc_votes');
      });
  });
  it("400: Responds with 'Article ID must be a number' if article_id not a number, ", () => {
    const identifier = 'notNum';
    return request(app)
      .patch(`/api/articles/${identifier}`)
      .send({ inc_votes: 2 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Article ID must be a number');
      });
  });
  it("400: Responds with 'Votes property must be a number' if inc_votes not a number, ", () => {
    const identifier = 3;
    const votesIsNaN = 'notNum';
    return request(app)
      .patch(`/api/articles/1`)
      .send({ inc_votes: votesIsNaN })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Votes property must be a number');
      });
  });
});

// SUCCESS PATHS
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
  it('200: Responds with a given article that matches the ID of the params and comments count of 2', () => {
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
          comment_count: '2',
        });
      });
  });
  it('200: Responds with a given article that matches the ID of the params and comments count of 0 for article without comments', () => {
    const identifier = 4;
    return request(app)
      .get(`/api/articles/${identifier}`)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual({
          article_id: identifier,
          title: 'Student SUES Mitch!',
          topic: 'mitch',
          author: 'rogersop',
          body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
          created_at: '2020-05-06T01:14:00.000Z',
          votes: 0,
          comment_count: '0',
        });
      });
  });
});

describe('Valid PATCH requests: vote increment / decrements via /api/articles/:article_id ', () => {
  it('201: Should accept valid vote increment, responding with updated article', () => {
    const identifier = 3;
    return request(app)
      .patch(`/api/articles/${identifier}`)
      .send({ inc_votes: 2 })
      .expect(201)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual({
          article_id: identifier,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: '2020-11-03T09:12:00.000Z',
          votes: 2,
        });
      });
  });
  it('201: Should accept valid vote decrement, responding with updated article', () => {
    const identifier = 1;
    return request(app)
      .patch(`/api/articles/${identifier}`)
      .send({ inc_votes: -2 })
      .expect(201)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual({
          article_id: identifier,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 98,
        });
      });
  });
});
