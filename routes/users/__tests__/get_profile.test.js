const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const populateUsers = require("../../__utils__/populateUsers");
const User = require("../../../models/User");
const Profile = require("../../../models/Profile");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users GET_PROFILE", () => {
    describe("", () => {
        beforeAll(async () => await populateUsers());
        afterAll(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const users = await User.find();
            const userId = users[0]._id.toString();
            const response = await request(app).get(`/api/users/${userId}/profile`);

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const users = await User.find();
            const userId = users[0]._id.toString();
            const response = await request(app).get(`/api/users/${userId}/profile`);

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate profile", async () => {
            const users = await User.find().exec();
            const userId = users[0]._id.toString();
            const profile = await Profile.find({ user: userId }).exec();
            const response = await request(app).get(`/api/users/${userId}/profile`);

            expect(response.body.profile).toBeDefined();
            expect(response.body.profile._id).toEqual(profile._id);
        });
    });
});
