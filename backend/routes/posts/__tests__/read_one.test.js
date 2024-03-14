const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts READ_ONE", () => {
    describe("database has posts", () => {
        let response;
        let post;
        beforeAll(async () => {
            await populate.posts();
            const posts = await Post.find().exec();
            post = posts[0];
            response = await request(app).get(`/api/posts/${post._id}`);
        });
        afterAll(async () => {
            await database.dropCollections();
            post = null;
            response = null;
        });

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has accurate post", async () => {
            expect(response.body.post).toBeDefined();
            expect(response.body.post._id.toString()).toEqual(post._id.toString());
        });

        describe("Post does not exist", () => {
            let response;
            beforeAll(async () => {
                const unsavedPost = new Post();
                response = await request(app).get(`/api/posts/${unsavedPost._id}`);
            });
            afterAll(async () => {
                response = null;
            });

            test("should return 400 status code", async () => {
                expect(response.status).toBe(400);
            });
            test("should return false success field and defined message", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("Invalid Post ID", () => {
            let response;
            beforeAll(async () => response = await request(app).get("/api/posts/:ksjdnvksjv"));
            afterAll(async () => response = null);

            test("should return 500 status code", async () => {
                expect(response.status).toBe(500);
            });
            test("should return false success field and defined message", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => {
            const unsavedPost = new Post();
            response = await request(app).get(`/api/posts/${unsavedPost._id}`);
        });
        afterAll(async () => {
            response = null;
        });

        test("should return 400 status code", async () => {
            expect(response.statusCode).toBe(400);
        });
        test("should return false success field and defined message", async () => {
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });
    });
});
