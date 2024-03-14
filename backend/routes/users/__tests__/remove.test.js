const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users REMOVE", () => {
    describe("client authenticated & authorized", () => {
        let response;
        let user;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            user = loginRes.body.user;

            response = await request(app)
                .delete(`/api/users/${user._id}`)
                .set("Authorization", `Bearer ${token}`);
        });
        afterAll(async () => {
            await database.dropCollections();
            user = null;
            response = null;
        });

        test("should return 200 status code and json content type header", async () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain truthy success field and message", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("user should not exist in databse post request", async () => {
            const userExists = await User.findById(user._id).exec();
            expect(userExists).toBeFalsy();
        });
    });

    describe("client not authenticated", () => {
        let response;
        describe("token not present", () => {
            beforeAll(async () => {
                await populate.users();
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const user = loginRes.body.user;

                response = await request(app)
                    .delete(`/api/users/${user._id}`);
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
                    .delete(`/api/users/${user._id}`)
                    .set("Authorization", `Bearer ${token}`);
            });
            afterAll(async () => {
                response = null;
                await database.dropCollections();
            });
    
            test("should return 404 status code and json content type header", async () => {
                expect(response.statusCode).toBe(400);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("should contain falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("client not authorized", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;
            deleteUser = await User.findOne({ username: "username2" }).exec();

            response = await request(app)
                .delete(`/api/users/${deleteUser._id}`)
                .set("Authorization", `Bearer ${token}`);
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
});
