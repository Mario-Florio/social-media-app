const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users CREATE", () => {
    describe("Given username and password (and optional email)", () => {
        beforeEach(async () => await populate.users());
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code and json content type header", async () => {
            const bodyData = [
                { credentials: { username: "1username", password: "password" } },
                { credentials: { email: "email@host.com", username: "2username", password: "password" } },
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/api/users").send(body);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            }
        });
        test("response body has truthy success field and message defined", async () => {
            const bodyData = [
                { credentials: { username: "1username", password: "password" } },
                { credentials: { email: "email@host.com", username: "2username", password: "password" } },
            ]
            for (const body of bodyData) {
                const response = await request(app).post("/api/users").send(body);

                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            }
        });
        test("response body has accurate user and email", async () => {
            const bodyData = [
                { credentials: { email: "1email@host.com", username: "1username", password: "password" } },
                { credentials: { email: "2email@host.com", username: "2username", password: "password" } },
                { credentials: { email: "3email@host.com", username: "3username", password: "password" } }
            ];

            for (const body of bodyData) {
                const response = await request(app).post("/api/users").send(body);

                expect(response.body.user.username).toEqual(body.credentials.username);
                expect(response.body.user.email).toEqual(body.credentials.email);
            }
        });

        describe("input is invalid", () => {
            const bodyData = [
                { credentials: { username: "username", password: "passwor" } }, // password < 8
                { credentials: { username: "username", password: "passwordpasswordpasswordpasswordpassword" } }, // pasword > 25
                { credentials: { email: "email", username: "username", password: "password" } } // invalid email
            ];
            test("should respond with status code 422", async () => {
                for (const data of bodyData) {
                    const response = await request(app).post("/api/users").send(data);
                    expect(response.statusCode).toBe(422);
                }
            });
            test("response body has falsy success field and message defined", async () => {
                for (const data of bodyData) {
                    const response = await request(app).post("/api/users").send(data);
                    expect(response.body.success).toBeFalsy();
                    expect(response.body.message).toBeDefined();
                }
            });
        });

        describe("username already exists", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                response = await request(app).post("/api/users").send({
                    credentials: {
                        username: "username1",
                        password: "password"
                    }
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
            test("response body has falsy success field and message field", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("email already exists", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                response = await request(app).post("/api/users").send({
                    credentials: {
                        email: "email1@host.com",
                        username: "username",
                        password: "password"
                    }
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
            test("response body has falsy success field and message field", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("Missing credentials or username and/or password", () => {
        const bodyData = [
            { credentials: { email: "email@host.com", username: "username" } },
            { credentials: { email: "email@host.com", password: "password" } },
            { credentials: { email: "email@host.com" } },
            {}
        ];
        test("should respond with status code 400", async () => {
            for (const data of bodyData) {
                const response = await request(app).post("/api/users").send(data);
                expect(response.statusCode).toBe(400);
            }
        });
        test("response body has falsy success field and message defined", async () => {
            for (const data of bodyData) {
                const response = await request(app).post("/api/users").send(data);
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            }
        });
    });
});
