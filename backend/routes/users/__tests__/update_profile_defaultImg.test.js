const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const { defaultProfileImages, defaultCoverImages } = require("../../../globals/defaultImgs");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users UPDATE_PROFILE_DEFAULTIMG", () => {
    describe("client authenticated & authorized", () => {
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

        test("should return 200 status code and json content type header", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile/default-img`)
                .set("Authorization", `Bearer ${token}`)
                .send({ picture: "Default-profilePic" });
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("should contain truthy success field and message defined", async () => {
            const response = await request(app)
                .put(`/api/users/${user._id}/profile/default-img`)
                .set("Authorization", `Bearer ${token}`)
                .send({ picture: "Default-profilePic" });
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body should contain updated profile", async () => {
            const profileImgsData = defaultProfileImages.map(image => {
                const data = {
                    reqBody: { picture: image.name },
                    exprectedUrlResponse: image.url
                }
                return data;
            });

            const coverImgsData = defaultCoverImages.map(image => {
                const data = {
                    reqBody: { coverPicture: image.name },
                    exprectedUrlResponse: image.url
                }
                return data;
            });

            const bodyData = [ ...profileImgsData, ...coverImgsData ];

            for (const data of bodyData) {
                const response = await request(app)
                    .put(`/api/users/${user._id}/profile/default-img`)
                    .set("Authorization", `Bearer ${token}`)
                    .send(data.reqBody);

                expect(
                    response.body.user.profile.picture && response.body.user.profile.picture.url === data.exprectedUrlResponse ||
                    response.body.user.profile.coverPicture && response.body.user.profile.coverPicture.url === data.exprectedUrlResponse
                ).toBeTruthy();
            }
        });

        describe("input is invalid", () => {
            let response;
            beforeAll(async () => {
                response = await request(app)
                    .put(`/api/users/${user._id}/profile/default-img`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ picture: "" });
            })
            test("should respond with status code 422", async () => {
                expect(response.statusCode).toBe(422);
            });
            test("response body has falsy success field and message defined", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
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
                const user = loginRes.body.user;

                response = await request(app)
                    .put(`/api/users/${user._id}/profile/default-img`)
                    .send({ picture: "Default-profilePic" });
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
                const user = loginRes.body.user;

                response = await request(app)
                    .put(`/api/users/${user._id}/profile/default-img`)
                    .set("Authorization", `Bearer ${token}`)
                    .send({ picture: "Default-profilePic" });
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
            const user = loginRes.body.user;

            const updateUser = await User.findOne({ username: "username2" }).exec();

            response = await request(app)
                .put(`/api/users/${updateUser._id}/profile/default-img`)
                .set("Authorization", `Bearer ${token}`)
                .send({ picture: "Default-profilePic" });
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
