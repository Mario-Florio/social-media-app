const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const User = require("../../../models/User");
const Post = require("../../../models/Post");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/users READ_ALL", () => {
    describe("database has users", () => {
        describe("default query", () => {
            let response;
            beforeAll(async () => {
                await populate.users();
                response = await request(app).get("/api/users");
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
                expect(response.body.users).toBeDefined();
                expect(Array.isArray(response.body.users)).toBeTruthy();
                expect(response.body.users.length).toEqual(10);
                expect(response.body.users[0].username).toEqual("username1");
                expect(response.body.users[1].username).toEqual("username10");
                expect(response.body.users[2].username).toEqual("username11");
                expect(response.body.users[3].username).toEqual("username12");
                expect(response.body.users[4].username).toEqual("username13");
                expect(response.body.users[5].username).toEqual("username14");
                expect(response.body.users[6].username).toEqual("username15");
                expect(response.body.users[7].username).toEqual("username16");
                expect(response.body.users[8].username).toEqual("username17");
                expect(response.body.users[9].username).toEqual("username18");
            });
        });

        describe("query string used", () => {
            describe("limit", () => {
                let response;
                beforeAll(async () => {
                    await populate.users();
                    response = await request(app).get("/api/users?limit=15");
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
                    expect(response.body.users).toBeDefined();
                    expect(Array.isArray(response.body.users)).toBeTruthy();
                    expect(response.body.users.length).toEqual(15);
                    expect(response.body.users[0].username).toEqual("username1");
                    expect(response.body.users[1].username).toEqual("username10");
                    expect(response.body.users[2].username).toEqual("username11");
                    expect(response.body.users[3].username).toEqual("username12");
                    expect(response.body.users[4].username).toEqual("username13");
                    expect(response.body.users[5].username).toEqual("username14");
                    expect(response.body.users[6].username).toEqual("username15");
                    expect(response.body.users[7].username).toEqual("username16");
                    expect(response.body.users[8].username).toEqual("username17");
                    expect(response.body.users[9].username).toEqual("username18");
                    expect(response.body.users[10].username).toEqual("username19");
                    expect(response.body.users[11].username).toEqual("username2");
                    expect(response.body.users[12].username).toEqual("username3");
                    expect(response.body.users[13].username).toEqual("username4");
                    expect(response.body.users[14].username).toEqual("username5");
                });
            });

            describe("page", () => {
                let response;
                beforeAll(async () => {
                    await populate.users();
                    response = await request(app).get("/api/users?page=1");
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
                    expect(response.body.users).toBeDefined();
                    expect(Array.isArray(response.body.users)).toBeTruthy();
                    expect(response.body.users.length).toEqual(9);
                    expect(response.body.users[0].username).toEqual("username19");
                    expect(response.body.users[1].username).toEqual("username2");
                    expect(response.body.users[2].username).toEqual("username3");
                    expect(response.body.users[3].username).toEqual("username4");
                    expect(response.body.users[4].username).toEqual("username5");
                    expect(response.body.users[5].username).toEqual("username6");
                    expect(response.body.users[6].username).toEqual("username7");
                    expect(response.body.users[7].username).toEqual("username8");
                    expect(response.body.users[8].username).toEqual("username9");
                });
            });

            describe("search", () => {
                describe("finds matches", () => {
                    let response;
                    beforeAll(async () => {
                        await populate.users();
                        response = await request(app).get("/api/users?search=9");
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
                        expect(response.body.users).toBeDefined();
                        expect(Array.isArray(response.body.users)).toBeTruthy();
                        expect(response.body.users.length).toEqual(2);
                        expect(response.body.users[0].username).toEqual("username19");
                        expect(response.body.users[1].username).toEqual("username9");
                    });
                });

                describe("no matches", () => {
                    let response;
                    beforeAll(async () => {
                        await populate.users();
                        response = await request(app).get("/api/users?search=not in database");
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
                        expect(response.body.users).toBeDefined();
                        expect(Array.isArray(response.body.users)).toBeTruthy();
                        expect(response.body.users.length).toEqual(0);
                    });
                });
            });

            describe("populate", () => {
                describe("user", () => {
                    let response;
                    beforeAll(async () => {
                        await populate.many();
                        const user = await User.findOne({ username: "username1" }).exec();
                        const popObj = {
                            model: "User",
                            _id: user._id,
                            fields: ["following"]
                        };
                        response = await request(app).get(`/api/users?populate=${JSON.stringify(popObj)}`);
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
                        expect(response.body.users).toBeDefined();
                        expect(Array.isArray(response.body.users)).toBeTruthy();
                        expect(response.body.users.length).toEqual(2);
                        expect(response.body.users[0].username).toEqual("username2");
                        expect(response.body.users[1].username).toEqual("username3");
                    });
                });

                describe("post", () => {
                    let response;
                    beforeAll(async () => {
                        await populate.many();
                        const post = await Post.findOne({ text: "Hello world" }).exec();
                        const popObj = {
                            model: "Post",
                            _id: post._id,
                            fields: ["likes"]
                        };
                        response = await request(app).get(`/api/users?populate=${JSON.stringify(popObj)}`);
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
                        expect(response.body.users).toBeDefined();
                        expect(Array.isArray(response.body.users)).toBeTruthy();
                        expect(response.body.users.length).toEqual(1);
                        expect(response.body.users[0].username).toEqual("username1");
                    });
                });
            });
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => response = await request(app).get("/api/users"));
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
            expect(response.body.users).toBeDefined();
            expect(Array.isArray(response.body.users)).toBeTruthy();
            expect(response.body.users.length).toEqual(0);
        });
    });
});
