const app = require("./app");
const request = require("supertest");

describe("/", () => {
    it("should return Hello World", async () => {
        const response = await request(app).get("/api");

        expect(response.body).toBe("Hello World");
    });
});
