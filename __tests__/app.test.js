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
        expect(res.body.msg).toBe('Article 1234567890 not found');
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
        expect(res.body.msg).toBe('Article 1234567890 not found');
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

describe('Errors: GET requests for /api/articles/:article_id/comments', () => {
  it("404: Responds with 'No article found' message given article_id that doesn't exist", () => {
    const identifier = 1234567890;
    return request(app)
      .get(`/api/articles/${identifier}/comments`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(`Article ${identifier} not found`);
      });
  });
  it("404: Responds with 'Invalid path' given GET path that doesn't exist", () => {
    const identifier = 1;
    return request(app)
      .get(`/api/articles/${identifier}/blahblahblah`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe('Path not found');
      });
  });
  it("400: Responds with 'Article ID must be a number' message given article_id that isn't a number", () => {
    const identifier = 'NotANum';
    return request(app)
      .get(`/api/articles/${identifier}/comments`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Article ID must be a number');
      });
  });
  it("400: Responds with 'Article ID must be a number' message given article_id that is a SQL injection", () => {
    const identifier = 'DROP DATABASE nc_news_test;';
    return request(app)
      .get(`/api/articles/${identifier}/comments`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe('Article ID must be a number');
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

describe('Success path: GET requests for /api/articles/:article_id/comments', () => {
  it('200: Responds with an array of comments given article_id with following properties: comment_id, votes, created_at, author, body', () => {
    const identifier = 9;
    return request(app)
      .get(`/api/articles/${identifier}/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments.length).toBe(2);
        expect(res.body.comments[1]).toEqual({
          author: 'icellusedkars',
          body: 'The owls are not what they seem.',
          comment_id: 17,
          created_at: '2020-03-14T17:02:00.000Z',
          votes: 20,
        });
      });
  });
  it('200: Responds with empty array given article_id without comments', () => {
    const identifier = 4;
    return request(app)
      .get(`/api/articles/${identifier}/comments`)
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments.length).toBe(0);
      });
  });
});
