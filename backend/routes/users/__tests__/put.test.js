const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const populateUsers = require("../../__utils__/populateUsers");
const bcrypt = require("bcryptjs");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users PUT", () => {
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
                .put(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "updated-username",
                    password: "password"
                });
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "updated-username",
                    password: "password"
                });
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain updated user and message", async () => {
            const bodyData = [
                { username: "updated-username1", password: "password1" },
                { username: "updated-username2", password: "password2" },
                { username: "updated-username3", password: "password3" }
            ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${user._id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                expect(response.body.user.username).toBe(data.username);
                expect(response.body.message).toBeDefined();
            }
        });
    });
});
