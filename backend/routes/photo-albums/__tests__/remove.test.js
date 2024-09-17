const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Album = require("../../../models/photos/Album");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/photo-albums DELETE", () => {
    describe("client authenticated & authorized", () => {
        let token = null;
        let user = null;
        let album = null;
        beforeEach(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            token = loginRes.body.token;
            user = loginRes.body.user;

            await populate.albums();
            album = await Album.findOne({ user: user._id }).exec();
        });
        afterEach(async () => {
            token = null;
            user = null;
            album = null;
            await database.dropCollections();
        });

        describe("given name", () => {
            test("should return 200 status code and json content type header", async () => {
                const response = await request(app).delete(`/api/photo-albums/${album._id}`)
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has success and message fields defined", async () => {
                const response = await request(app).delete(`/api/photo-albums/${album._id}`)
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            });
            test("album does not exist in database", async () => {
                const response = await request(app).delete(`/api/photo-albums/${album._id}`)
                    .set("Authorization", `Bearer ${token}`);

                const deletedAlbumExists = await Album.findById(album._id).exec();

                expect(deletedAlbumExists).toBeFalsy();
            });
        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();

                await populate.albums();
                const album = await Album.findOne({ user: user._id }).exec();

                response = await request(app)
                    .delete(`/api/photo-albums/${album._id}`);
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
                const token = "unsigned";
                const user = await User.findOne({ username: "username1" }).populate("profile").exec();

                await populate.albums();
                const album = await Album.findOne({ user: user._id }).exec();

                response = await request(app).delete(`/api/photo-albums/${album._id}`)
                    .set("Authorization", `Bearer ${token}`);
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

    describe("client not authorized (user is not authorized to create post in proposed name)", () => {
        let response;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username2",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;

            const authorUser = await User.findOne({ username: "username2" }).exec();

            await populate.albums();
            const albums = await Album.find().exec();
            const album = albums[0];
            
            response = await request(app).delete(`/api/photo-albums/${album._id}`)
                .set("Authorization", `Bearer ${token}`);
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
