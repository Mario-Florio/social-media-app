const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts UPDATE", () => {
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

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .put(`/api/posts/${post._id}`)
                .send({ text: "Updated post text." })
                .set("Authorization", `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain truthy success field and message", async () => {
            const response = await request(app)
                .put(`/api/posts/${post._id}`)
                .send({ text: "Updated post text." })
                .set("Authorization", `Bearer ${token}`);

            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body should contain updated user", async () => {
            const bodyData = [
                { text: "Updated post text 1" },
                { text: "Updated post text 2" },
                { text: "Updated post text 3" }
            ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/posts/${post._id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                expect(response.body.post.text).toBe(data.text);
            }
        });

        describe("input is invalid", () => {
            const bodyData = [
                { text: "12" }, // text < 3
                { text: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } // text > 250
            ];
            test("should respond with status code 422", async () => {
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/posts/${post._id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
                    expect(response.statusCode).toBe(422);
                }
            });
            test("response body has falsy success field and message defined", async () => {
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/posts/${post._id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
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
                await populate.posts();
                const posts = await Post.find().exec();
                const post = posts[0];

                response = await request(app)
                    .put(`/api/posts/${post._id}`)
                    .send({ text: "Updated post text." });
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
                    .put(`/api/posts/${post._id}`)
                    .send({ text: "Updated post text." })
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
                .put(`/api/posts/${post._id}`)
                .send({ text: "Updated post text." })
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