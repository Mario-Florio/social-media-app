const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users READ_ONE", () => {
    describe("database has users", () => {
        let response;
        let user;
        beforeAll(async () => {
            await populate.users();
            const users = await User.find().exec();
            user = users[0];
            response = await request(app).get(`/api/users/${user._id}`);
        });
        afterAll(async () => {
            await database.dropCollections();
            user = null;
            response = null;
        });

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has accurate user", async () => {
            expect(response.body.user).toBeDefined();
            expect(response.body.user._id.toString()).toEqual(user._id.toString());
        });
        test("user does not contain email", async () => {
            expect(response.body.user.email).toBeFalsy();
        });
        test("user does not contain password", async () => {
            expect(response.body.user.password).toBeFalsy();
        });

        describe("User does not exist", () => {
            let response;
            beforeAll(async () => {
                const unsavedUser = new User();
                response = await request(app).get(`/api/users/${unsavedUser._id}`);
            });
            afterAll(async () => {
                response = null;
            });

            test("should return 400 status code", async () => {
                expect(response.statusCode).toBe(400);
            });
            test("should return false success field and defined message", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("Invalid User ID", () => {
        let response;
        beforeAll(async () => {
            response = await request(app).get("/api/users/s;djvn9prvbn");
        });
        afterAll(async () => {
            response = null;
        });

        test("should return 500 status code", async () => {
            expect(response.statusCode).toBe(500);
        });
        test("should return false success field and defined message", async () => {
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => {
            const unsavedUser = new User();
            response = await request(app).get(`/api/users/${unsavedUser._id}`);
        });
        afterAll(async () => {
            response = null;
        });

        test("should return 400 status code", async () => {
            expect(response.statusCode).toBe(400);
        });
        test("should return false success field and defined message", async () => {
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });
    });
});
