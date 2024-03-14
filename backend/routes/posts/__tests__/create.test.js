const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts CREATE", () => {
    describe("client authenticated & authorized", () => {
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

        describe("input is invalid", () => {
            test("should respond with status code 422", async () => {
                const bodyData = [
                    { forum: user.profile.forum, post: { user: user._id, text: "12" } }, // text < 3
                    { forum: user.profile.forum, post: { user: user._id, text: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } } // text > 250
                ];
                for (const data of bodyData) {
                    const response = await request(app)
                        .post("/api/posts/")
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
                    expect(response.statusCode).toBe(422);
                }
            });
            test("response body has falsy success field and message defined", async () => {
                const bodyData = [
                    { forum: user.profile.forum, post: { user: user._id, text: "12" } }, // text < 3
                    { forum: user.profile.forum, post: { user: user._id, text: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } } // text > 250
                ];
                for (const data of bodyData) {
                    const response = await request(app)
                        .post("/api/posts/")
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
                await populate.users();
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();

                response = await request(app)
                    .post("/api/posts")
                    .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } });
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
                const token = "unsigned";
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();

                response = await request(app).post("/api/posts")
                    .send({ forum: user.profile.forum, post: { user: user._id, text: "This is a new post" } })
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
            
            response = await request(app).post("/api/posts")
                .send({ forum: user.profile.forum, post: { user: authorUser._id, text: "This is a new post" } })
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