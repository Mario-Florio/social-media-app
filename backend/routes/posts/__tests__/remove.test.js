const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts REMOVE", () => {
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

    describe("client authenticated", () => {
        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain truthy success field and message", async () => {
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("post should not exist in databse post request", async () => {
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set("Authorization", `Bearer ${token}`);

            const postExists = await Post.findById(post._id).exec();

            expect(postExists).toBeFalsy();
        });
    });

    describe("client not authorized", () => {
        let token = null;
        let user = null;
        let post = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username2",
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

        test("should return 404 status code and json content type header", async () => {
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("client not authenticated (token unverified)", () => {
        test("should return 404 status code and json content type header", async () => {
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });

    describe("token tampered, not present or otherwise invalid", () => {
        test("should return 404 status code and json content type header", async () => {
            token = "";
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should return 404 status code and json content type header", async () => {
            token += "tamper";
            const response = await request(app)
                .delete(`/api/posts/${post._id}`)

            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
    });
});
