const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users READ_ONE", () => {
    describe("database has users", () => {
        let user;
        beforeEach(async () => {
            await populate.users();
            const users = await User.find().exec();
            user = users[0];
        });
        afterEach(async () => {
            user = null;
            await database.dropCollections();
        });

        test("should return 200 status code", async () => {
            const response = await request(app).get(`/api/users/${user._id}`);

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).get(`/api/users/${user._id}`);

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate user", async () => {
            const response = await request(app).get(`/api/users/${user._id}`);

            expect(response.body.user).toBeDefined();
            expect(response.body.user._id.toString()).toEqual(user._id.toString());
        });
        test("should return null if user is not found", async () => {
            const response = await request(app).get("/api/users/:ksjdnvksjv");

            expect(response.body.user).toBeNull();
        });
    });

    describe("database is empty", () => {
        test("should return null", async () => {
            const response = await request(app).get("/api/users/:ksjdnvksjv");

            expect(response.body.user).toBeNull();
        });
    })
});
