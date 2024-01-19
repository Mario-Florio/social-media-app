const app = require("./app");
const request = require("supertest");

describe("Test suite", () => {
    it("should return Hello World", async () => {
        const response = await request(app).get("/").send();

        expect(response.body).toBe("Hello World");
    });
});
