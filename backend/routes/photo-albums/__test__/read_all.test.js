const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/photo-albums READ_ALL", () => {
    describe("database has albums", () => {
        let response;
        beforeAll(async () => {
            await populate.albums();
            response = await request(app).get("/api/photo-albums");
        });
        afterAll(async () => {
            await database.dropCollections();
            response = null;
        });

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message field defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has accurate users array", async () => {
            expect(response.body.albums).toBeDefined();
            expect(Array.isArray(response.body.albums)).toBeTruthy();
            expect(response.body.albums.length).toEqual(13);
            expect(response.body.albums[0].name).toEqual("All");
            expect(response.body.albums[1].name).toEqual("Profile Pictures");
            expect(response.body.albums[2].name).toEqual("Cover Photos");
            expect(response.body.albums[3].name).toEqual("album1");
            expect(response.body.albums[4].name).toEqual("album2");
            expect(response.body.albums[5].name).toEqual("album3");
            expect(response.body.albums[6].name).toEqual("album4");
            expect(response.body.albums[7].name).toEqual("album5");
            expect(response.body.albums[8].name).toEqual("album6");
            expect(response.body.albums[9].name).toEqual("album7");
            expect(response.body.albums[10].name).toEqual("album8");
            expect(response.body.albums[11].name).toEqual("album9");
            expect(response.body.albums[12].name).toEqual("album10");
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => response = await request(app).get("/api/photo-albums"));
        afterAll(async () => response = null);

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response body has truthy success field and message field defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        });
        test("response body has empty users array", async () => {
            expect(response.body.albums).toBeDefined();
            expect(Array.isArray(response.body.albums)).toBeTruthy();
            expect(response.body.albums.length).toEqual(0);
        });
    });
});