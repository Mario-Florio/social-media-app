const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Album = require("../../../models/photos/Album");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/photo-albums UPDATE", () => {
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
                const response = await request(app).put(`/api/photo-albums/${album._id}`)
                    .send({ name: "Updated name" })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has success and message fields defined", async () => {
                const response = await request(app).put(`/api/photo-albums/${album._id}`)
                    .send({ name: "Update name" })
                    .set("Authorization", `Bearer ${token}`);

                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            });
            test("update album exists and response body contains it", async () => {
                const bodyData = [
                    { name: "Update name 1" },
                    { name: "Update name 2" },
                    { name: "Update name 3" }
                ]

                for (const data of bodyData) {
                    const response = await request(app).put(`/api/photo-albums/${album._id}`)
                        .send(data)
                        .set("Authorization", `Bearer ${token}`);

                    const updatedAlbumExists = await Album.findOne({ name: data.name }).exec();

                    expect(response.body.album).toBeDefined();
                    expect(updatedAlbumExists).toBeTruthy();
                    expect(response.body.album.name === updatedAlbumExists.name).toBeTruthy();
                }
            });
        });

        describe("missing name", () => {
            test("should return 400 status code", async () => {
                const response = await request(app).put(`/api/photo-albums/${album._id}`)
                    .send({})
                    .set("Authorization", `Bearer ${token}`);

                expect(response.statusCode).toBe(400);
            });
        });

        describe("input is invalid", () => {
            test("should respond with status code 422", async () => {
                const bodyData = [
                    { name: "This string is greater than 25 characters" },
                    { name: "Update name", desc: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } // text > 250
                ];
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/photo-albums/${album._id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
                    expect(response.statusCode).toBe(422);
                }
            });
            test("response body has falsy success field and message defined", async () => {
                const bodyData = [
                    { name: "This string is greater than 25 characters" },
                    { name: "Update name", desc: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } // text > 250
                ];
                for (const data of bodyData) {
                    const response = await request(app)
                        .put(`/api/photo-albums/${album._id}`)
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
                    expect(response.body.success).toBeFalsy();
                    expect(response.body.message).toBeDefined();
                }
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
                    .put(`/api/photo-albums/${album._id}`)
                    .send({ name: "Update name" });
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

                response = await request(app).put(`/api/photo-albums/${album._id}`)
                    .send({ name: "Update name" })
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
            
            response = await request(app).put(`/api/photo-albums/${album._id}`)
                .send({ name: "New Album" })
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
