const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts REMOVE", () => {
    describe("client authenticated & authroized", () => {
        let response;
        let post;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;
    
            await populate.posts();
            const posts = await Post.find().exec();
            post = posts[0];
    
            response = await request(app)
                    .delete(`/api/posts/${post._id}`)
                    .set("Authorization", `Bearer ${token}`);
        });
        afterAll(async () => {
            response = null;
            post = null;
            await database.dropCollections();
        });
    
        describe("client authenticated", () => {
            test("should return 200 status code and json content type header", async () => {
                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body should contain truthy success field and message", async () => {
                expect(response.body.success).toBeTruthy();
                expect(response.body.message).toBeDefined();
            });
            test("post should not exist in databse post request", async () => {
                const postExists = await Post.findById(post._id).exec();
                expect(postExists).toBeFalsy();
            });
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            beforeAll(async () => {
                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app)
                    .delete(`/api/posts/${post._id}`);
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
                const token = "unsigned";

                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app)
                    .delete(`/api/posts/${post._id}`)
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

    describe("client not authorized (user is not authorized to update specified post)", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username2",
                password: "password"
            });
            const token = loginRes.body.token;

            await populate.posts();
            const posts = await Post.find().exec();
            const post = posts[0];
            
            response = await request(app)
                .delete(`/api/posts/${post._id}`)
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
