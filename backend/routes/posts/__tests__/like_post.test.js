const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts LIKE_POST", () => {
    describe("client authenticated", () => {
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
        
        describe("input given", () => {
            test("should return 200 status code and json content type header", async () => {
                const response = await request(app)
                    .put(`/api/posts/${post._id}/like`)
                    .send({ userId: user._id })
                    .set("Authorization", `Bearer ${token}`);
    
                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body should contain truthy success field and message", async () => {
                const response = await request(app)
                    .put(`/api/posts/${post._id}/like`)
                    .send({ userId: user._id })
                    .set("Authorization", `Bearer ${token}`);
    
                expect(response.body.success).toBeTruthy();
                expect(response.body.message).toBeDefined();
            });
            test("response body should contain properly updated post (liked vs unliked)", async () => {
                const bodyData = [
                    { userId: user._id },
                    { userId: user._id },
                    { userId: user._id }
                ];

                let i = 0;
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/posts/${post._id}/like`)
                        .send({ userId: user._id })
                        .set("Authorization", `Bearer ${token}`);
        
                    switch(i) {
                        case 0:
                            expect(response.body.post.likes.includes(user._id)).toBeTruthy();
                            break;
                        case 1:
                            expect(response.body.post.likes.includes(user._id)).toBeFalsy();
                            break;
                        case 2:
                            expect(response.body.post.likes.includes(user._id)).toBeTruthy();
                            break;
                        default:
                    }
                    i++;
                }
            });
        });

        describe("no input given", () => {
            test("should return 400 status code and json content type header", async () => {
                const response = await request(app)
                    .put(`/api/posts/${post._id}/like`)
                    .send({})
                    .set("Authorization", `Bearer ${token}`);
    
                expect(response.statusCode).toBe(400);
            });
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const user = await User.findOne({ username: "username1" }).exec();

                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app)
                    .put(`/api/posts/${post._id}/like`)
                    .send({ userId: user._id });
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
                const user = await User.findOne({ username: "username1" }).exec();
                const token = "unsigned";

                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app)
                    .put(`/api/posts/${post._id}/like`)
                    .send({ userId: user._id })
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
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const unauthorizedUser = await User.findOne({ username: "username2" }).exec();

            await populate.posts();
            const posts = await Post.find().exec();
            const post = posts[0];
            
            response = await request(app)
                .put(`/api/posts/${post._id}/like`)
                .send({ userId: unauthorizedUser._id })
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