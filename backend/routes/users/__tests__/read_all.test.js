const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users READ_ALL", () => {
    describe("database has users", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            response = await request(app).get("/api/users");
        });
        afterAll(async () => {
            await database.dropCollections();
            response = null;
        });

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message field defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has accurate users array", async () => {
            expect(response.body.users).toBeDefined();
            expect(Array.isArray(response.body.users)).toBeTruthy();
            expect(response.body.users[0].username).toEqual("username1");
            expect(response.body.users[1].username).toEqual("username2");
            expect(response.body.users[2].username).toEqual("username3");
            expect(response.body.users[3].username).toEqual("username4");
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => response = await request(app).get("/api/users"));
        afterAll(async () => response = null);

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message field defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has empty users array", async () => {
            expect(response.body.users).toBeDefined();
            expect(Array.isArray(response.body.users)).toBeTruthy();
            expect(response.body.users.length).toEqual(0);
        });
    });
});
