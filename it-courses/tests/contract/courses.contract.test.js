const nock = require('nock');
const fs = require('fs');
const path = require('path');
const CoursesApiClient = require('../../server/services/coursesApiClient');
const { sampleCourses } = require('../fixtures/courses');
const { validateCoursesList } = require('../helpers/contractValidator');

/**
 * BP-1: Отримання каталогу курсів
 * Consumer: CoursesApiClient | Provider: json-server (stub через nock / WireMock)
 */
describe('Contract BP-1: Courses catalog', () => {
  const wiremockMapping = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../wiremock/mappings/get-courses.json'),
      'utf-8'
    )
  );

  afterEach(() => {
    nock.cleanAll();
  });

  it('provider response matches catalog contract schema', async () => {
    const stubBase = 'http://127.0.0.1:8091';
    const expectedBody = wiremockMapping.response.jsonBody;

    nock(stubBase)
      .get(wiremockMapping.request.urlPath)
      .reply(wiremockMapping.response.status, expectedBody);

    const client = new CoursesApiClient(stubBase);
    const courses = await client.getCourses();

    expect(validateCoursesList(courses)).toBe(true);
    expect(courses[0].title).toBe(expectedBody[0].title);
    expect(nock.isDone()).toBe(true);
  });

  it('project fixture fulfills the same consumer contract', () => {
    expect(validateCoursesList(sampleCourses)).toBe(true);
    expect(sampleCourses).toHaveLength(3);
  });
});
