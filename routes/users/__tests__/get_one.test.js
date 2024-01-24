const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users GET_ONE", () => {
    describe("database has users", () => {
        beforeAll(async () => await populateUsers());
        afterAll(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const users = await User.find();
            const userId = users[0]._id.toString();
            const response = await request(app).get(`/api/users/${userId}`);

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const users = await User.find();
            const userId = users[0]._id.toString();
            const response = await request(app).get(`/api/users/${userId}`);

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate user", async () => {
            const users = await User.find();
            const userId = users[0]._id.toString();
            const response = await request(app).get(`/api/users/${userId}`);

            expect(response.body.user).toBeDefined();
            expect(response.body.user._id.toString()).toEqual(userId);
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

// UTILS
async function populateUsers() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    await new User({ username: "username1", password: hashedPassword }).save();
    await new User({ username: "username2", password: hashedPassword }).save();
    await new User({ username: "username3", password: hashedPassword }).save();
    await new User({ username: "username4", password: hashedPassword }).save();
}