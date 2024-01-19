const createApp = require("../../app");
const request = require("supertest");

const app = createApp();

describe("/users", () => {
    it("should return Hello from /auth", async () => {
        const response = await request(app).get("/auth");

        expect(response.body).toBe("Hello from /auth");
    });
});
