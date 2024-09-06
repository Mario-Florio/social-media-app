const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/comments CREATE", () => {
    describe("client authenticated & authorized", () => {
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
        describe("given user and text", () => {
            test("should return 200 status code and json content type header", async () => {
                const response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has truthy success field and message field defined", async () => {
                const response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.success).toBeTruthy();
                expect(response.body.message).toBeDefined();
            });
            test("should return accurate comment", async () => {
                const bodyData = [
                    { postId: post._id, comment: { user: user._id, text: "comment 1" } },
                    { postId: post._id, comment: { user: user._id, text: "comment 2" } },
                    { postId: post._id, comment: { user: user._id, text: "comment 3" } },
                    { postId: post._id, comment: { user: user._id, text: "comment 4" } }
                ];

                let i = 1;
                for (const data of bodyData) {
                    const response = await request(app).post("/api/comments")
                        .send(data)
                        .set("Authorization", `Bearer ${token}`);

                    expect(response.body.comment.text).toEqual(data.comment.text);
                    i++;
                }
            });
            test("response body comment user does not contain password", async () => {
                const response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.comment.user.password).toBeFalsy();
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
            test("response body has falsy success field and message field defined", async () => {
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

                    expect(response.body.success).toBeFalsy();
                    expect(response.body.message).toBeDefined();
                }
            });
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();

                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } });
            });
            afterAll(async () => {
                response = null;
                await database.dropCollections();
            });

            test("should return 404 status code and json content type header", async () => {
                expect(response.statusCode).toBe(404);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("should contain falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("token invalid (unverified)", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();
                const token = "unsigned";

                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app).post("/api/comments")
                    .send({ postId: post._id, comment: { user: user._id, text: "Hello" } })
                    .set("Authorization", `Bearer ${token}`);
            });
            afterAll(async () => { 
                response = null;
                await database.dropCollections();
            });
            
            test("should return 400 status code and json content type header", async () => {
                expect(response.statusCode).toBe(400);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("should contain falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("client not authorized (user is not authorized to create post in proposed name)", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;
            const authorUser = await User.findOne({ username: "username2" }).exec();

            await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

            response = await request(app).post("/api/comments")
                .send({ postId: post._id, comment: { user: authorUser._id, text: "Hello" } })
                .set("Authorization", `Bearer ${token}`);
        });
        afterAll(async () => {
            await database.dropCollections();
            response = null;
        });
    
        test("should return 404 status code and json content type header", async () => {
            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should contain falsy success field and message defined", async () => {
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });
    });
});
