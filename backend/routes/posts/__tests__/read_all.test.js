const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts READ_ALL", () => {
    describe("database has posts", () => {
        beforeEach(async () => await populate.posts());
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app).get("/api/posts");

            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate posts", async () => {
            const response = await request(app).get("/api/posts?profile=hello");

            expect(response.body.posts).toBeDefined();
            expect(Array.isArray(response.body.posts)).toBeTruthy();
            expect(response.body.posts.length).toEqual(4);
        });
    });

    describe("database is empty", () => {
        test("should return empty array", async () => {
            const response = await request(app).get("/api/posts");

            expect(response.body.posts).toBeDefined();
            expect(Array.isArray(response.body.posts)).toBeTruthy();
            expect(response.body.posts.length).toEqual(0);
        })
    });
});
