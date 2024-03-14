const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users FOLLOW_PROFILE", () => {
    describe("client authenticated & authorized", () => {
        let token = null;
        let clientUser = null;
        let peerUser = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            clientUser = loginRes.body.user;
            peerUser = await User.findOne({ username: "username2" }).exec();
        });
        afterEach(async () => await database.dropCollections());

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${peerUser._id}/profile/follow`)
                .set("Authorization", `Bearer ${token}`)
                .send({ userId: clientUser._id, follow: true });

            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body should have message, success, and both client & peer user fields defined", async () => {
            const response = await request(app)
                .put(`/api/users/${peerUser._id}/profile/follow`)
                .set("Authorization", `Bearer ${token}`)
                .send({ userId: clientUser._id, follow: true });

            expect(response.body.message).toBeDefined();
            expect(response.body.success).toBeDefined();
            expect(response.body.clientUser).toBeDefined();
            expect(response.body.peerUser).toBeDefined();
        });
        test("response body should follow and unfollow accurately", async () => {
            const bodyData = [
                { userId: clientUser._id, follow: true },
                { userId: clientUser._id, follow: true },
                { userId: clientUser._id, follow: false },
                { userId: clientUser._id, follow: false }
            ];

            let i = 0;
            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${peerUser._id}/profile/follow`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data);

                switch(i) {
                    case 0:
                        expect(response.body.success).toBeTruthy();
                        expect(response.body.clientUser.profile.following.includes(peerUser._id.toString())).toBeTruthy();
                        expect(response.body.peerUser.profile.followers.includes(clientUser._id.toString())).toBeTruthy();
                    break;
                    case 1:
                        expect(response.statusCode).toEqual(404);
                        expect(response.body.success).toBeFalsy();
                    break;
                    case 2:
                        expect(response.body.success).toBeTruthy();
                        expect(response.body.clientUser.profile.following.includes(peerUser._id.toString())).toBeFalsy();
                        expect(response.body.peerUser.profile.followers.includes(clientUser._id.toString())).toBeFalsy();
                    break;
                    case 3:
                        expect(response.statusCode).toEqual(404);
                        expect(response.body.success).toBeFalsy();
                    break;
                    default:
                }
                i++;
            }
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const clientUser = loginRes.body.user;
                const peerUser = await User.findOne({ username: "username2" }).exec();

                response = await request(app)
                    .put(`/api/users/${peerUser._id}/profile/follow`)
                    .send({ userId: clientUser._id, follow: true });
            });
            afterAll(async () => {
                response = null;
                await database.dropCollections();
            });

            test("should return 404 status code and json content type header", async () => {
                expect(response.statusCode).toBe(404);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("should contain falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("token invalid (unverified)", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const token = "unsigned";
                const clientUser = loginRes.body.user;
                const peerUser = await User.findOne({ username: "username2" }).exec();

                response = await request(app)
                    .put(`/api/users/${peerUser._id}/profile/follow`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ userId: clientUser._id, follow: true });
            });
            afterAll(async () => { 
                response = null;
                await database.dropCollections();
            });
            
            test("should return 400 status code and json content type header", async () => {
                expect(response.statusCode).toBe(400);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("should contain falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("client not authorized (user is not authorized to update specified user)", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const clientUser = loginRes.body.user;
            const peerUser = await User.findOne({ username: "username2" }).exec();
            const falseUser = await User.findOne({ username: "username2" }).exec();
            
            response = await request(app)
                .put(`/api/users/${peerUser._id}/profile/follow`)
                .set("Authorization", `Bearer ${token}`)
                .send({ userId: falseUser._id, follow: true });
        });
        afterAll(async () => {
            await database.dropCollections();
            response = null;
        });
    
        test("should return 404 status code and json content type header", async () => {
            expect(response.statusCode).toBe(404);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should contain falsy success field and message defined", async () => {
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });
    });
});