const createApp = require("../../app");
const request = require("supertest");

const app = createApp();

describe("/auth", () => {
    describe("given username and password", () => {
        it("should return 200 status code", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "username",
                password: "password",
            });
    
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "username",
                password: "password"
            });
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response has user", async () => {
            const response = await request(app).post("/api/auth/login").send({
                username: "username",
                password: "password"
            });
            expect(response.body.user).toBeDefined();
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
                const response = await request(app).post("/api/auth/login").send(data);
                expect(response.statusCode).toBe(400);
            }
        });
    });
});
