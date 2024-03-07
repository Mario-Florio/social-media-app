const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users CREATE", () => {
    describe("given username and password", () => {
        beforeEach(async () => await populate.users());
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app).post("/api/users").send({
                username: "username",
                password: "password"
            });
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has success, message, and user fields defined", async () => {
            const response = await request(app).post("/api/users").send({
                username: "username",
                password: "password"
            });
            expect(response.body.success).toBeDefined();
            expect(response.body.message).toBeDefined();
            expect(response.body.user).toBeDefined();
        });

        describe("username already exists", () => {
            beforeEach(async () => await populate.users());
            afterEach(async () => await database.dropCollections());

            test("should return 404 status code and json content type header", async () => {
                const response = await request(app).post("/api/users").send({
                    username: "username1",
                    password: "password"
                });
                expect(response.statusCode).toBe(404);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has success and message field defined", async () => {
                const response = await request(app).post("/api/users").send({
                    username: "username1",
                    password: "password"
                });
                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("missing username and/or password", () => {
        test("should respond with status code 400", async () => {
            const bodyData = [
                { username: "username" },
                { password: "password" },
                {}
            ];

            for (const data of bodyData) {
                const response = await request(app).post("/api/users").send(data);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});
