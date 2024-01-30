const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts READ_ONE", () => {
    describe("database has posts", () => {
        let post;
        beforeEach(async () => {
            await populate.posts();
            const posts = await Post.find().exec();
            post = posts[0];
        });
        afterEach(async () => {
            post = null;
            await database.dropCollections();
        });

        test("should return 200 status code", async () => {
            const response = await request(app).get(`/api/posts/${post._id}`);

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).get(`/api/posts/${post._id}`);

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate post", async () => {
            const response = await request(app).get(`/api/posts/${post._id}`);

            expect(response.body.post).toBeDefined();
            expect(response.body.post._id.toString()).toEqual(post._id.toString());
        });
        test("should return null if post is not found", async () => {
            const response = await request(app).get("/api/posts/:ksjdnvksjv");

            expect(response.body.post).toBeNull();
        });
    });

    describe("database is empty", () => {
        test("should return null", async () => {
            const response = await request(app).get("/api/posts/:ksjdnvksjv");

            expect(response.body.post).toBeNull();
        });
    });
});
