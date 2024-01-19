const createApp = require("../../app");
const request = require("supertest");

const app = createApp();

describe("/users", () => {
    it("should return Hello from /users", async () => {
        const response = await request(app).get("/users");

        expect(response.body).toBe("Hello from /users");
    });
});
