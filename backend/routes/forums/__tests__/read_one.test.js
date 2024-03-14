const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Forum = require("../../../models/Forum");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/forums READ_ONE", () => {
    describe("database has forums", () => {
        let response;
        let forum;
        beforeAll(async () => {
            await populate.users();
            const forums = await Forum.find().exec();
            forum = forums[0];

            response = await request(app).get(`/api/forums/${forum._id}`);
        });
        afterAll(async () => {
            response = null;
            forum = null;
            await database.dropCollections();
        });

        test("should return 200 status code", async () => {
            expect(response.statusCode).toBe(200);
        });
        test("should specify json in the content type header", async () => {
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
        });
        test("response has truthy success field & message fields defined", async () => {
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBeDefined();
        })
        test("response body has accurate forum", async () => {
            expect(response.body.forum).toBeDefined();
            expect(response.body.forum._id.toString()).toEqual(forum._id.toString());
        });

        describe("Forum does not exist", () => {
            let response;
            beforeAll(async () => {
                const unsavedForum = new Forum();
                response = await request(app).get(`/api/forums/${unsavedForum._id}`);
            });
            afterAll(async () => {
                response= null;
            });
            test("should return 400 status code", async () => {
                expect(response.statusCode).toBe(400);
            });
            test("should return falsy success field and defined message", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });

        describe("Invalid Forum ID", () => {
            let response;
            beforeAll(async () => response = await request(app).get(`/api/forums/kjdfbvepuirhv39obv`));
            afterAll(async () => response= null);
            test("should return 500 status code", async () => {
                expect(response.statusCode).toBe(500);
            });
            test("should return false success field and defined message", async () => {
                expect(response.body.success).toBeFalsy();
                expect(response.body.message).toBeDefined();
            });
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => {
            const unsavedForum = new Forum();
            response = await request(app).get(`/api/forums/${unsavedForum._id}`);
        });
        afterAll(async () => {
            response = null;
        })
        test("should return status 400", async () => {
            expect(response.statusCode).toBe(400);
        });
        test("should return false success field and defined message", async () => {
            expect(response.body.success).toBeFalsy();
            expect(response.body.message).toBeDefined();
        });
    });
});
