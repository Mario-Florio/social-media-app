const createApp = require("./app");
const request = require("supertest");

const app = createApp();

describe("/", () => {
    it("should return Hello World", async () => {
        const response = await request(app).get("/");

        expect(response.body).toBe("Hello World");
    });
});

describe("/users", () => {
    it("should return Hello from /users", async () => {
        const response = await request(app).get("/users");

        expect(response.body).toBe("Hello from /users");
    });
});
