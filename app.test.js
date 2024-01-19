const createApp = require("./app");
const request = require("supertest");

const app = createApp();

describe("/", () => {
    it("should return Hello World", async () => {
        const response = await request(app).get("/");

        expect(response.body).toBe("Hello World");
    });
});
