const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts READ_ALL", () => {
    describe("database has posts", () => {
        let response;
        beforeEach(async () => {
            await populate.posts();
            response = await request(app).get("/api/posts");
        });
        afterEach(async () => {
            await database.dropCollections();
            response = null;
        });

        test("should return 200 status code and json content type header", async () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message field defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has accurate posts", async () => {
            expect(response.body.posts).toBeDefined();
            expect(Array.isArray(response.body.posts)).toBeTruthy();
            expect(response.body.posts.length).toEqual(4);
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => response = await request(app).get("/api/posts"));
        afterAll(async () => response = null);

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message field defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has empty users array", async () => {
            expect(response.body.posts).toBeDefined();
            expect(Array.isArray(response.body.posts)).toBeTruthy();
            expect(response.body.posts.length).toEqual(0);
        });
    });
});
