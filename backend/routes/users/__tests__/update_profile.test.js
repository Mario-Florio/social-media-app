const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users UPDATE_PROFILE", () => {
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
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({ bio: "Updated bio..." });
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should contain truthy success field and message defined", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({ bio: "Updated bio..." });
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body should contain updated profile and message", async () => {
            const bodyData = [
                { bio: "Update bio 1..." },
                { bio: "Updated bio 2..." },
                { bio: "Updated bio 3..." }
            ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${user._id}/profile`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                expect(response.body.user.profile.bio).toBe(data.bio);
            }
        });
        test("user contains email", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({ bio: "Updated bio..." });
            expect(response.body.user.email).toEqual(user.email);
        });
        test("user does not contain password", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({ bio: "Updated bio..." });
            expect(response.body.user.password).toBeFalsy();
        });

        describe("input is invalid", () => {
            let response;
            beforeAll(async () => {
                response = await request(app)
                    .put(`/api/users/${user._id}/profile`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ bio: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" });
            })
            test("should respond with status code 422", async () => {
                expect(response.statusCode).toBe(422);
            });
            test("response body has falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const user = loginRes.body.user;

                response = await request(app)
                    .put(`/api/users/${user._id}/profile`)
                    .send({ bio: "Updated bio..." });
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
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const token = "unsigned";
                const user = loginRes.body.user;

                response = await request(app)
                    .put(`/api/users/${user._id}/profile`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ bio: "Updated bio..." });
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

    describe("client not authorized (user is not authorized to update specified user)", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;

            const updateUser = await User.findOne({ username: "username2" }).exec();

            response = await request(app)
                .put(`/api/users/${updateUser._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({ bio: "Updated bio..." });
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
