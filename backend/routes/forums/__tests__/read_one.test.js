const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Forum = require("../../../models/Forum");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/forums READ_ONE", () => {
    describe("database has forums", () => {
        let forum;
        beforeEach(async () => {
            await populate.users();
            const forums = await Forum.find().exec();
            forum = forums[0];
        });
        afterEach(async () => {
            forum = null;
            await database.dropCollections();
        });

        test("should return 200 status code", async () => {
            const response = await request(app).get(`/api/forums/${forum._id}`);

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).get(`/api/forums/${forum._id}`);

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate forum, and success and message fields defined", async () => {
            const response = await request(app).get(`/api/forums/${forum._id}`);

            expect(response.body.forum).toBeDefined();
            expect(response.body.forum._id.toString()).toEqual(forum._id.toString());
            expect(response.body.success).toBeDefined();
            expect(response.body.message).toBeDefined();
        });
        test("should return null if forum is not found", async () => {
            const response = await request(app).get("/api/forums/:ksjdnvksjv");

            expect(response.body.forum).toBeNull();
        });
    });

    describe("database is empty", () => {
        test("should return null", async () => {
            const response = await request(app).get("/api/forums/:ksjdnvksjv");

            expect(response.body.forum).toBeNull();
        });
    });
});
