const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Album = require("../../../models/photos/Album");
const Photo = require("../../../models/photos/Photo");
const path = require("path");
const crypto = require("crypto");

const randomImageName = (bytes=32) => crypto.randomBytes(bytes).toString("hex");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

jest.mock("multer", () => {
    const multer = () => ({
        array: () => {
            return (req, res, next) => {
                req.files = [
                    {
                        filename: randomImageName()+".jpg"
                    }
                ]
                return next();
            }
        }
    });
    multer.diskStorage = () => jest.fn();
    return multer;
});

describe("/photo-albums CREATE_PHOTOS", () => {
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

            response = await request(app)
                .post(`/api/photo-albums/${album._id}/photos`)
                .send({ user: user._id, name: "Photo name", caption: "Photo caption" })
                .set("Authorization", `Bearer ${token}`);
        });
        afterAll(async () => {
            response = null;
            await database.dropCollections();
        });

        describe("given user & photos", () => {
            test("should return 200 status code and json content type header", async () => {
                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });

            test("response body has success and message fields defined", async () => {
                expect(response.body.success).toBeDefined();
                expect(response.body.message).toBeDefined();
            });

            test("new photos exists and response body contains it", async () => {
                expect(response.body.photos).toBeDefined();
            });
        });

        describe("missing user & photos", () => {

            test("should return 400 status code", async () => {

            });

            test("response body has falsy success field and message defined", async () => {

            });
        });

        describe("input is invalid", () => {
            let user = null;
            let token = null;
            let album = null;
            beforeAll(async () => {
                const loginRes = await request(app).post("/api/auth/login").send({
                    username: "username1",
                    password: "password"
                });
                token = loginRes.body.token;
                user = loginRes.body.user;

                album = await Album.findOne({ name: "album1" }).exec();
            });
            afterAll(async () => {
                user = null;
                token = null;
                album = null;
            });
            test("should respond with status code 422", async () => {
                const bodyData = [
                    { user: user._id, name: "12" }, // less than 3 chars
                    { user: user._id, name: "This string is greater than 25 characters" },
                    { user: user._id, name: "New Photo", caption: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } // text > 250
                ];
                for (const data of bodyData) {
                    const response = await request(app)
                        .post(`/api/photo-albums/${album._id}/photos`)
                        .set("Authorization", `Bearer ${token}`)
                        .send(data);
                    expect(response.statusCode).toBe(422);
                }
            });

            test("response body has falsy success field and message defined", async () => {
                const bodyData = [
                    { user: user._id, name: "This string is greater than 25 characters" },
                    { user: user._id, name: "New Album", caption: "This string is greater than 250 characters... 51xM,qQhRqJk5EFmr4)TPCfSmR_V$_z2)L(KA=){K4CB#V]w-yP,GG8N59R&H&@3S5vh4CDh]C3S0Yckav]UBTd{]:uK8,0gfU9;&u{%*y!.GMt/c&-6E#VU1S.cj]v_q?H0WSDHeRea!r;N*i!KSA00L;V7(._}CcknNkX]99eG,R7=6P/,ST$77qW%-V=hg{yywg28ASN,P4Wdqb,H[-+%7w9ikWDHm5ywzb1h2ka,M34qZ8-ec0x8RZ" } // text > 250
                ];
                for (const data of bodyData) {
                    const response = await request(app)
                        .post(`/api/photo-albums/${album._id}/photos`)
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
    
                response = await request(app)
                    .post(`/api/photo-albums/${album._id}/photos`)
                    .send({ user: user._id, name: "Photo name", caption: "Photo caption" });
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

                response = await request(app)
                    .post(`/api/photo-albums/${album._id}/photos`)
                    .send({ user: user._id, name: "Photo name", caption: "Photo caption" })
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
                username: "username1",
                password: "password"
            });
            const token = loginRes.body.token;
            const user = loginRes.body.user;
            const authorUser = await User.findOne({ username: "username2" }).exec();

            await populate.albums();
            const album = await Album.findOne({ name: "album1" }).exec();

            response = await request(app)
                .post(`/api/photo-albums/${album._id}/photos`)
                .send({ user: authorUser._id, name: "Photo name", caption: "Photo caption" })
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
