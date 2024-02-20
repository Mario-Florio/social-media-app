const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts CREATE", () => {
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

    describe("client authenticated & authorized", () => {
        describe("given user and text", () => {
            test("should return 200 status code and json content type header", async () => {
                const response = await request(app).post("/api/posts")
                    .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has success and message fields defined", async () => {
                const response = await request(app).post("/api/posts")
                    .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("missing user and/or text", () => {
            test("should return 400 status code", async () => {
                const bodyData = [
                    { forum: user.profile.forum, post: { user: user._id } },
                    { forum: user.profile.forum, post: { text: "This is a new post" } },
                    { forum: user.profile.forum, post: {} }
                ];

                for (const data of bodyData) {
                    const response = await request(app).post("/api/posts")
                        .send(data)
                        .set("Authorization", `Bearer ${token}`);

                    expect(response.statusCode).toBe(400);
                }
            });
        });
    });

    describe("client not authorized", () => {
        let token = null;
        let user = null;
        let authorUser = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
            authorUser = await User.findOne({ username: "username2" }).exec();
        });
        afterEach(async () => {
            token = null;
            user = null;
            authorUser = null;
            await database.dropCollections();
        });

        test("should return 404 status code and json content type header", async () => {
            const response = await request(app).post("/api/posts")
                .send({ forum: user.profile.forum, post: { user: authorUser._id, text: "This is a new post" } })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("client not authenticated (token unverified)", () => {
        test("should return 404 status code and json content type header", async () => {
            const response = await request(app).post("/api/posts")
                .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } });

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("token tampered, not present or otherwise invalid", () => {
        test("should return 400 status code and json content type header", async () => {
            token = "";
            const response = await request(app).post("/api/posts")
                .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should return 400 status code and json content type header", async () => {
            token += "tamper";
            const response = await request(app).post("/api/posts")
                .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });
});