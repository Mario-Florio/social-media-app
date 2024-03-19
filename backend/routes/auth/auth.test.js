const app = require("../../app");
const request = require("supertest");
const database = require("../__utils__/testDb");
const populate = require("../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/auth", () => {
    describe("given username and password", () => {
        beforeEach(async () => await populate.users());
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password",
            });
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has user, message, and token defined", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            expect(response.body.user).toBeDefined();
            expect(response.body.message).toBeDefined();
            expect(response.body.token).toBeDefined();
        });
        
        describe("user doesn't exist", () => {
            beforeEach(async () => await populate.users());
            afterEach(async () => await database.dropCollections());

            test("should return 400 status code", async () => {
                const response = await request(app).post("/api/auth/login").send({
                    username: "usernameDoesntExist",
                    password: "password"
                });
                expect(response.statusCode).toBe(400);
            });
            test("user returned should be falsy", async () => {
                const response = await request(app).post("/api/auth/login").send({
                    username: "usernameDoesntExist",
                    password: "password"
                });
                expect(response.body.user).toBeFalsy();
            });
            test("token should be undefined", async () => {
                const response = await request(app).post("/api/auth/login").send({
                    username: "usernameDoesntExist",
                    password: "password"
                });
                expect(response.body.token).toBeUndefined();
            });
        });

        describe("wrong password", () => {
            beforeEach(async () => await populate.users());
            afterEach(async () => await database.dropCollections());

            test("should return 404 status code", async () => {
                const response = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "wrongpassword"
                });
                expect(response.statusCode).toBe(404);
            });
            test("user returned should be falsy", async () => {
                const response = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "wrongpassword"
                });
                expect(response.body.user).toBeFalsy();
            });
            test("token should be undefined", async () => {
                const response = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "wrongpassword"
                });
                expect(response.body.token).toBeUndefined();
            });
        });
    });

    describe("missing username and/or password", () => {
        test("should respond with status code 400", async () => {
            const bodyData = [
                { username: "username1" },
                { password: "password" },
                {}
            ];

            for (const data of bodyData) {
                const response = await request(app).post("/api/auth/login").send(data);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});
