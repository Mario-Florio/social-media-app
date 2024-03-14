const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users UPDATE", () => {
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

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "updated-username",
                    password: "password"
                });
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should contain truthy success field and message defined", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "updated-username",
                    password: "password"
                });
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body should contain updated user", async () => {
            const bodyData = [
                { username: "updated-username1", password: "password1" },
                { username: "updated-username2", password: "password2" },
                { username: "updated-username3", password: "password3" }
            ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${user._id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                expect(response.body.user.username).toBe(data.username);
            }
        });

        describe("input is invalid", () => {
            const bodyData = [
                { username: "username", password: "passwor" }, // password < 8
                { username: "username", password: "passwordpasswordpasswordpasswordpassword" } // pasword > 25
            ];
            test("should respond with status code 422", async () => {
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/users/${user._id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
                    expect(response.statusCode).toBe(422);
                }
            });
            test("response body has falsy success field and message defined", async () => {
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/users/${user._id}`)
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
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const user = loginRes.body.user;

                response = await request(app)
                    .put(`/api/users/${user._id}`)
                    .send({
                        username: "updated-username",
                        password: "password"
                    });
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
                    .put(`/api/users/${user._id}`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({
                        username: "updated-username",
                        password: "password"
                    });
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
                .put(`/api/users/${updateUser._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "updated-username",
                    password: "password"
                });
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
