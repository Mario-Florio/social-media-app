const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users READ_ALL", () => {
    describe("database has users", () => {
        beforeEach(async () => await populate.users());
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const response = await request(app).get("/api/users");

            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).get("/api/users");

            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has accurate users array", async () => {
            const response = await request(app).get("/api/users");

            expect(response.body.users).toBeDefined();
            expect(Array.isArray(response.body.users)).toBeTruthy();
            expect(response.body.users[0].username).toEqual("username1");
            expect(response.body.users[1].username).toEqual("username2");
            expect(response.body.users[2].username).toEqual("username3");
            expect(response.body.users[3].username).toEqual("username4");
        });
    });
    describe("database is empty", () => {
        test("should return empty array", async () => {
            const response = await request(app).get("/api/users");

            expect(response.body.users).toBeDefined();
            expect(Array.isArray(response.body.users)).toBeTruthy();
            expect(response.body.users.length).toEqual(0);
        })
    })
});