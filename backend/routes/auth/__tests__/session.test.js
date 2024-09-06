const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/auth SESSION", () => {
    describe("client authenticated", () => {
        let response = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
            response = await request(app)
                .get("/api/auth/session")
                .set("Authorization", `Bearer ${token}`)
                .send();
        });
        afterEach(async () => {
            response = null;
            await database.dropCollections();
        });

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has user, message, and token defined", async () => {
            expect(response.body.user.email).toBeDefined();
            expect(response.body.user.password).toBeFalsy();
            expect(response.body.user).toBeDefined();
            expect(response.body.message).toBeDefined();
            expect(response.body.token).toBeDefined();
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response = null;
            beforeEach(async () => {
                response = await request(app)
                    .get("/api/auth/session")
                    .send();
            });
            afterEach(async () => {
                response = null;
            });
            
            test("should return 404 status code and json in content-type header", () => {
                expect(response.statusCode).toBe(404);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body should contain falsy success & token field, and defined message field", () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.token).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("invalid token (unverifiable)", () => {
            let response = null;
            beforeEach(async () => {
                const token = "invalid";
                response = await request(app)
                    .get("/api/auth/session")
                    .set("Authorization", `Bearer ${token}`)
                    .send();
            });
            afterEach(async () => {
                response = null;
            });
            
            test("should return 400 status code and json in content-type header", () => {
                expect(response.statusCode).toBe(400);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body should contain falsy success & token field, and defined message field", () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.token).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });
});
