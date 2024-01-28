const app = require("../../../app");
const request = require("supertest");
const database = require("../../../testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users PUT_PROFILE", () => {
    describe("client authenticated", () => {
        let token = null;
        let user = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;
        });
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    bio: "Updated bio...",
                    picture: "new pic"
                });
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    bio: "Updated bio...",
                    picture: "new pic"
                });
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should contain updated profile and message", async () => {
            const bodyData = [
                { bio: "Update bio 1...", picture: "new pic" },
                { bio: "Updated bio 2...", picture: "new pic" },
                { bio: "Updated bio 3...", picture: "new pic" }
            ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${user._id}/profile`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                expect(response.body.profile.bio).toBe(data.bio);
                expect(response.body.profile.picture).toBe(data.picture);
                expect(response.body.message).toBeDefined();
            }
        });
    });

    describe("client not authenticated", () => {
        let user = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            user = loginRes.body.user;
        });
        afterEach(async () => await database.dropCollections());

        test("should return 404 status code", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .send({
                    bio: "Updated bio...",
                    picture: ""
                });
            expect(response.statusCode).toBe(404);
        });
        test("should return appropriate message", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile`)
                .send({
                    bio: "Updated bio...",
                    picture: ""
                });
            expect(response.body.message).toBe("Action is forbidden");
        });
    });
});
