const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/comments READ_ALL", () => {
    describe("database has posts", () => {
        let response;
        beforeAll(async () => {
            await populate.posts();
            response = await request(app).get("/api/comments");
        });
        afterAll(async () => {
            response = null;
            await database.dropCollections();
        });

        test("should return 200 status code and json content type header", async () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message defined", async () => {
            expect(response.body.success).toBeDefined();
            expect(response.body.message).toBeDefined();
        })
        test("response body has accurate comments array", async () => {
            expect(response.body.comments).toBeDefined();
            expect(Array.isArray(response.body.comments)).toBeTruthy();
            expect(response.body.comments.length).toEqual(19);
        });
    });

    describe("database is empty", () => {
        test("should return empty array", async () => {
            const response = await request(app).get("/api/comments");

            expect(response.body.comments).toBeDefined();
            expect(Array.isArray(response.body.comments)).toBeTruthy();
            expect(response.body.comments.length).toEqual(0);
        })
    });
});
