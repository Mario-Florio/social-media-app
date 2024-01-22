const app = require("../../app");
const request = require("supertest");

describe("/users", () => {
    it("should return 200 status code", async () => {
        const response = await request(app).get("/api/users");

        expect(response.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
        const response = await request(app).get("/api/users");

        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
    });
});
