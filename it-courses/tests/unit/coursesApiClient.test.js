const nock = require('nock');
const CoursesApiClient = require('../../server/services/coursesApiClient');
const { sampleCourses } = require('../fixtures/courses');

describe('CoursesApiClient', () => {
  const baseURL = 'http://127.0.0.1:8099';
  let client;

  beforeEach(() => {
    client = new CoursesApiClient(baseURL);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetches courses from remote API', async () => {
    nock(baseURL).get('/courses').reply(200, sampleCourses);

    const courses = await client.getCourses();
    expect(courses).toHaveLength(3);
    expect(nock.isDone()).toBe(true);
  });

  it('fetches course by id', async () => {
    nock(baseURL).get('/courses/1').reply(200, sampleCourses[0]);

    const course = await client.getCourseById(1);
    expect(course.title).toBe('QA engineer');
    expect(nock.isDone()).toBe(true);
  });
});
