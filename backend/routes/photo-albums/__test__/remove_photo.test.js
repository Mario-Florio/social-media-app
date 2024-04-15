const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Album = require("../../../models/photos/Album");
const Photo = require("../../../models/photos/Photo");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/photo-albums REMOVE_PHOTO", () => {
    describe("client authenticated & authorized", () => {
        let response = null;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;

            await populate.albums();
            const album = await Album.findOne({ name: "album1" }).exec();
            const photo = await Photo.findOne({ name: "photo1" }).exec();

            response = await request(app)
                .delete(`/api/photo-albums/${album._id}/photos/${photo._id}`)
                .set("Authorization", `Bearer ${token}`);
        });
        afterAll(async () => {
            response = null;
            await database.dropCollections();
        });

        test("should return 200 status code and json content type header", async () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });

        test("response body has success and message fields defined", async () => {
            expect(response.body.success).toBeDefined();
            expect(response.body.message).toBeDefined();
        });

        test("photo & it assigned image do not exist in database", async () => {

        });
    });

    describe("client not authenticated", () => {
        describe("token not present", () => {
            let response = null;
            beforeAll(async () => {
                await populate.users();    
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const user = loginRes.body.user;

                await populate.albums();
                const album = await Album.findOne({ name: "album1" }).exec();
                const photo = await Photo.findOne({ name: "photo1" }).exec();
    
                response = await request(app)
                    .delete(`/api/photo-albums/${album._id}/photos/${photo._id}`);
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
            let response = null;
            beforeAll(async () => {
                await populate.users();
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                const token = "unsigned";
                const user = loginRes.body.user;

                await populate.albums();
                const album = await Album.findOne({ name: "album1" }).exec();
                const photo = await Photo.findOne({ name: "photo1" }).exec();

                response = await request(app)
                    .delete(`/api/photo-albums/${album._id}/photos/${photo._id}`)
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

    describe("client not authorized (user is not authorized to create photo in proposed users name)", () => {
        let response = null;
        beforeAll(async () => {
            await populate.users();
            const loginRes = await request(app).post("/api/auth/login").send({
                username: "username2",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;
            const authorUser = await User.findOne({ username: "username1" }).exec();

            await populate.albums();
            const album = await Album.findOne({ name: "album1" }).exec();
            const photo = await Photo.findOne({ name: "photo1" }).exec();

            response = await request(app)
                .delete(`/api/photo-albums/${album._id}/photos/${photo._id}`)
                .set("Authorization", `Bearer ${token}`);
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
});
