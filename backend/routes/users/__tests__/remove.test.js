const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users REMOVE", () => {
    describe("client authenticated & authorized", () => {
        let token = null;
        let user = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
        });
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
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

    describe("client not authorized", () => {
        let token = null;
        let user = null;
        let deleteUser = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
            deleteUser = await User.findOne({ username: "username2" }).exec();
        });
        afterEach(async () => {
            token = null;
            user = null;
            deleteUser = null;
            await database.dropCollections();
        });

        test("should return 404 status code and json content type header", async () => {
            const response = await request(app)
                .delete(`/api/users/${deleteUser._id}`)
                .set("Authorization", `Bearer ${token}`);
                
            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("client not authenticated (token unverified)", () => {
        let user = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = "";
            user = loginRes.body.user;
        });
        afterEach(async () => {
            user = null;
            await database.dropCollections();
        });

        test("should return 404 status code and json content type header", async () => {
            const response = await request(app)
                .delete(`/api/users/${user._id}`);

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("token tampered, not present or otherwise invalid", () => {
        let token = null;
        let user = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
        });
        afterEach(async () => {
            token = null;
            user = null;
            await database.dropCollections();
        });

        test("should return 404 status code and json content type header", async () => {
            token = "";
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should return 404 status code and json content type header", async () => {
            token += "tamper";
            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });
});
