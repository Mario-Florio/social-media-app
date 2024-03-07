const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users UPDATE_PROFILE", () => {
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
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    bio: "Updated bio...",
                    picture: "new pic"
                });
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain updated profile and message", async () => {
            const bodyData = [
                { bio: "Update bio 1...", picture: "new pic" },
                { bio: "Updated bio 2...", picture: "new pic" },
                { bio: "Updated bio 3...", picture: "new pic" }
            ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${user._id}/profile`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                expect(response.body.profile.bio).toBe(data.bio);
                expect(response.body.profile.picture).toBe(data.picture);
                expect(response.body.message).toBeDefined();
                expect(response.body.success).toBeDefined();
            }
        });
    });

    describe("client not authorized", () => {
        let token = null;
        let user = null;
        let updateUser = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
            updateUser = await User.findOne({ username: "username2" }).exec();
        });
        afterEach(async () => {
            token = null;
            user = null;
            updateUser = null;
            await database.dropCollections();
        });

        test("should return 404 status code and json content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${updateUser._id}/profile`)
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
                .put(`/api/users/${user._id}/profile`);

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
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should return 404 status code and json content type header", async () => {
            token += "tamper";
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });
});
