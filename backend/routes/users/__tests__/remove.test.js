const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const populateUsers = require("../../__utils__/populateUsers");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users REMOVE", () => {
    describe("client authenticated", () => {
        let token = null;
        let user = null;
        beforeEach(async () => {
            await populateUsers();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
        });
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain truthy success field and message", async () => {
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("user should not exist in databse post request", async () => {
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            const userExists = await User.findById(user._id).exec();

            expect(userExists).toBeFalsy();
        });
    });
});
