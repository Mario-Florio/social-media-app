const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users POST", () => {
    describe("given username and password", () => {
        beforeEach(async () => await populateUsers());
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const response = await request(app).post("/api/users").send({
                username: "username",
                password: "password"
            });
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).post("/api/users").send({
                username: "username",
                password: "password"
            });
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has success and message fields defined", async () => {
            const response = await request(app).post("/api/users").send({
                username: "username",
                password: "password"
            });
            expect(response.body.success).toBeDefined();
            expect(response.body.message).toBeDefined();
        });

        describe("username already exists", () => {
            beforeEach(async () => await populateUsers());
            afterEach(async () => await database.dropCollections());

            test("should return 404 status code", async () => {
                const response = await request(app).post("/api/users").send({
                    username: "username1",
                    password: "password"
                });
                expect(response.statusCode).toBe(404);
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

// UTILS
async function populateUsers() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);
    await new User({ username: "username1", password: hashedPassword }).save();
    await new User({ username: "username2", password: hashedPassword }).save();
    await new User({ username: "username3", password: hashedPassword }).save();
    await new User({ username: "username4", password: hashedPassword }).save();
}
