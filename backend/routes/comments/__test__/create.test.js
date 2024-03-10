const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/comments CREATE", () => {
    let token = null;
    let user = null;
    let post = null;
    beforeEach(async () => {
        await populate.users();
        const loginRes = await request(app).post("/api/auth/login").send({
            username: "username1",
            password: "password"
        });
        token = loginRes.body.token;
        user = loginRes.body.user;

        await populate.posts();
        const posts = await Post.find().exec();
        post = posts[0];
    });
    afterEach(async () => {
        token = null;
        user = null;
        post = null;
        await database.dropCollections();
    });

    describe("client authenticated & authorized", () => {
        describe("given user and text", () => {
            test("should return 200 status code and json content type header", async () => {
                const response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has success and message fields defined", async () => {
                const response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            });
            test("should return comment", async () => { // TO DO
                const bodyData = [
                    { postId: post._id, comment: { text: "Hello" } },
                    { postId: post._id, comment: { user: user._id } },
                    { postId: post._id, comment: {} },
                    { comment: { user: user._id, text: "Hello" } }
                ];

                for (const data of bodyData) {
                    const response = await request(app).post("/api/comments")
                        .send(data)
                        .set("Authorization", `Bearer ${token}`);

                    expect(response.statusCode).toBe(400);
                }
            });
        });

        describe("missing postId, user and/or text", () => {
            test("should return 400 status code", async () => {
                const bodyData = [
                    { postId: post._id, comment: { text: "Hello" } },
                    { postId: post._id, comment: { user: user._id } },
                    { postId: post._id, comment: {} },
                    { comment: { user: user._id, text: "Hello" } }
                ];

                for (const data of bodyData) {
                    const response = await request(app).post("/api/comments")
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
        let post = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
            authorUser = await User.findOne({ username: "username2" }).exec();

            await populate.posts();
            const posts = await Post.find().exec();
            post = posts[0];
        });
        afterEach(async () => {
            token = null;
            user = null;
            authorUser = null;
            post = null;
            await database.dropCollections();
        });

        test("should return 404 status code and json content type header", async () => {
            const response = await request(app).post("/api/comments")
                .send({ postId: post._id, comment: { user: authorUser._id, text: "Hello" } })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("client not authenticated (token unverified)", () => {
        test("should return 404 status code and json content type header", async () => {
            const response = await request(app).post("/api/comments")
                .send({ postId: post._id, comment: { user: user._id, text: "Hello" } });

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("token tampered, not present or otherwise invalid", () => {
        test("should return 400 status code and json content type header", async () => {
            token = "";
            const response = await request(app).post("/api/comments")
                .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should return 400 status code and json content type header", async () => {
            token += "tamper";
            const response = await request(app).post("/api/comments")
                .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });
});
