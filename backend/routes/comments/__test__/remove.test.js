const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Post = require("../../../models/Post");
const Comment = require("../../../models/Comment");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/comments REMOVE", () => {
    describe("client authenticated & authorized", () => {
        describe("given user and text", () => {
            let response = null;
            let token = null;
            let user = null;
            let comment = null;
            beforeEach(async () => {
                await populate.users();
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                token = loginRes.body.token;
                user = loginRes.body.user;
        
                await populate.posts();
                comment = await Comment.findOne({ text: "This is a comment on post number 1" }).exec();

                response = await request(app)
                    .delete(`/api/comments/${comment._id}`)
                    .set("Authorization", `Bearer ${token}`);
            });
            afterEach(async () => {
                response = null
                token = null;
                user = null;
                comment = null;
                await database.dropCollections();
            });
            test("should return 200 status code and json content type header", async () => {
                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has truthy success field and message field defined", async () => {
                expect(response.body.success).toBeTruthy();
                expect(response.body.message).toBeDefined();
            });
            test("comment should not exist in database", async () => {
                const commentExists = await Comment.findOne({ text: "This is a comment on post number 1" }).exec();
                const posts = await Post.find().exec();
                const postsWithComment = [];
                for (const post of posts) {
                    if (post.comments.includes(comment._id)) {
                        postsWithComment.push(post);
                    }
                }

                expect(commentExists).toBeFalsy();
                expect(postsWithComment.length).toEqual(0);
            });
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            let comment;
            beforeAll(async () => {
                await populate.users();
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();

                await populate.posts();
                comment = await Comment.findOne({ text: "This is a comment on post number 1" }).exec();

                response = await request(app).delete(`/api/comments/${comment._id}`);
            });
            afterAll(async () => {
                response = null;
                comment = null;
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
            let comment;
            beforeAll(async () => {
                await populate.users();
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();
                const token = "unsigned";

                await populate.posts();
                comment = await Comment.findOne({ text: "This is a comment on post number 1" }).exec();

                response = await request(app).delete(`/api/comments/${comment._id}`)
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
        let comment;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;

            await populate.posts();
            comment = await Comment.findOne({ text: "This is a comment on post number 2" }).exec();

            response = await request(app).delete(`/api/comments/${comment._id}`)
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