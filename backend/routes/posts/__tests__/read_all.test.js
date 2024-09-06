const app = require("../../../app");
const request = require("supertest");
const database = require("../../__utils__/testDb");
const populate = require("../../__utils__/populate");
const Post = require("../../../models/Post");
const Forum = require("../../../models/Forum");
const User = require("../../../models/User");

beforeAll(async () => await database.connect());
afterAll(async () => await database.disconnect());

describe("/posts READ_ALL", () => {
    describe("database has posts", () => {
        describe("default query", () => {
            let response;
            beforeAll(async () => {
                await populate.posts();
                response = await request(app).get("/api/posts");
            });
            afterAll(async () => {
                await database.dropCollections();
                response = null;
            });
    
            test("should return 200 status code and json content type header", async () => {
                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            });
            test("response body has truthy success field and message field defined", async () => {
                expect(response.body.success).toBeTruthy();
                expect(response.body.message).toBeDefined();
            });
            test("response body has accurate posts", async () => {
                let numInPostText = 19;
                for (let i = 0; i < 10; i++) {
                    expect(response.body.posts[i].text.includes(numInPostText.toString())).toBeTruthy();
                    numInPostText--;
                }
                expect(response.body.posts).toBeDefined();
                expect(Array.isArray(response.body.posts)).toBeTruthy();
                expect(response.body.posts.length).toEqual(10); // default limit is 10
            });
            test("response body posts do not contain email and password", async () => {
                for (const post of response.body.posts) {
                    expect(post.user.email).toBeFalsy();
                    expect(post.user.password).toBeFalsy();
                }
            });
        });

        describe("query string used", () => {
            describe("limit", () => {
                let response;
                beforeAll(async () => {
                    await populate.posts();
                    response = await request(app).get("/api/posts?limit=15");
                });
                afterAll(async () => {
                    await database.dropCollections();
                    response = null;
                });
        
                test("should return 200 status code and json content type header", async () => {
                    expect(response.statusCode).toBe(200);
                    expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
                });
                test("response body has truthy success field and message field defined", async () => {
                    expect(response.body.success).toBeTruthy();
                    expect(response.body.message).toBeDefined();
                });
                test("response body has accurate post", async () => {
                    let numInPostText = 19;
                    for (let i = 0; i < 15; i++) {
                        expect(response.body.posts[i].text.includes(numInPostText.toString())).toBeTruthy();
                        numInPostText--;
                    }
                    expect(response.body.posts).toBeDefined();
                    expect(Array.isArray(response.body.posts)).toBeTruthy();
                    expect(response.body.posts.length).toEqual(15);
                });
                test("response body posts do not contain email and password", async () => {
                    for (const post of response.body.posts) {
                        expect(post.user.email).toBeFalsy();
                        expect(post.user.password).toBeFalsy();
                    }
                });
            });
    
            describe("page", () => {
                let response;
                beforeAll(async () => {
                    await populate.posts();
                    response = await request(app).get("/api/posts?page=1");
                });
                afterAll(async () => {
                    await database.dropCollections();
                    response = null;
                });
        
                test("should return 200 status code and json content type header", async () => {
                    expect(response.statusCode).toBe(200);
                    expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
                });
                test("response body has truthy success field and message field defined", async () => {
                    expect(response.body.success).toBeTruthy();
                    expect(response.body.message).toBeDefined();
                });
                test("response body has accurate post", async () => {
                    let numInPostText = 9;
                    for (let i = 0; i < 9; i++) {
                        expect(response.body.posts[i].text.includes(numInPostText.toString())).toBeTruthy();
                        numInPostText--;
                    }
                    expect(response.body.posts).toBeDefined();
                    expect(Array.isArray(response.body.posts)).toBeTruthy();
                    expect(response.body.posts.length).toEqual(9);
                });
                test("response body posts do not contain email and password", async () => {
                    for (const post of response.body.posts) {
                        expect(post.user.email).toBeFalsy();
                        expect(post.user.password).toBeFalsy();
                    }
                });
            });
    
            describe("userId", () => {
                describe("first user", () => {
                    let response;
                    let user;
                    beforeAll(async () => {
                        await populate.posts();
                        user = await User.findOne({ username: "username1" }).exec();
                        response = await request(app).get(`/api/posts?userId=${user._id}`);
                    });
                    afterAll(async () => {
                        await database.dropCollections();
                        response = null;
                        user = null;
                    });
            
                    test("should return 200 status code and json content type header", async () => {
                        expect(response.statusCode).toBe(200);
                        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
                    });
                    test("response body has truthy success field and message field defined", async () => {
                        expect(response.body.success).toBeTruthy();
                        expect(response.body.message).toBeDefined();
                    });
                    test("response body has accurate post", async () => {
                        for (let i = 0; i < 10; i++) {
                            expect(response.body.posts[i].user._id.toString() === user._id.toString()).toBeTruthy();
                        }
                        expect(response.body.posts).toBeDefined();
                        expect(Array.isArray(response.body.posts)).toBeTruthy();
                        expect(response.body.posts.length).toEqual(10); // default limit is 10
                    });
                    test("response body posts do not contain email and password", async () => {
                        for (const post of response.body.posts) {
                            expect(post.user.email).toBeFalsy();
                            expect(post.user.password).toBeFalsy();
                        }
                    });
                });
    
                describe("second user", () => {
                    let response;
                    let user;
                    beforeAll(async () => {
                        await populate.posts();
                        user = await User.findOne({ username: "username2" }).exec();
                        response = await request(app).get(`/api/posts?userId=${user._id}`);
                    });
                    afterAll(async () => {
                        await database.dropCollections();
                        response = null;
                        user = null;
                    });
            
                    test("should return 200 status code and json content type header", async () => {
                        expect(response.statusCode).toBe(200);
                        expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
                    });
                    test("response body has truthy success field and message field defined", async () => {
                        expect(response.body.success).toBeTruthy();
                        expect(response.body.message).toBeDefined();
                    });
                    test("response body has accurate post", async () => {
                        for (let i = 0; i < 9; i++) {
                            expect(response.body.posts[i].user._id.toString() === user._id.toString()).toBeTruthy();
                        }
                        expect(response.body.posts).toBeDefined();
                        expect(Array.isArray(response.body.posts)).toBeTruthy();
                        expect(response.body.posts.length).toEqual(9); // default limit is 10
                    });
                    test("response body posts do not contain email and password", async () => {
                        for (const post of response.body.posts) {
                            expect(post.user.email).toBeFalsy();
                            expect(post.user.password).toBeFalsy();
                        }
                    });
                });
            });

            describe("timeline (requires user)", () => {
                let response;
                let user1;
                let user2
                beforeAll(async () => {
                    await populate.posts();
                    user1 = await User.findOne({ username: "username1" }).exec();
                    user2 = await User.findOne({ username: "username2" }).exec();
                    response = await request(app).get(`/api/posts?userId=${user2._id}&timeline=true`);
                });
                afterAll(async () => {
                    await database.dropCollections();
                    response = null;
                    user1 = null;
                    user2 = null;
                });
        
                test("should return 200 status code and json content type header", async () => {
                    expect(response.statusCode).toBe(200);
                    expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
                });
                test("response body has truthy success field and message field defined", async () => {
                    expect(response.body.success).toBeTruthy();
                    expect(response.body.message).toBeDefined();
                });
                test("response body has accurate post", async () => {
                    for (let i = 0; i < 10; i++) {
                        if (i % 2 === 0) {
                            expect(response.body.posts[i].user._id.toString() === user1._id.toString()).toBeTruthy();
                        } else {
                            expect(response.body.posts[i].user._id.toString() === user2._id.toString()).toBeTruthy();
                        }
                    }
                    expect(response.body.posts).toBeDefined();
                    expect(Array.isArray(response.body.posts)).toBeTruthy();
                    expect(response.body.posts.length).toEqual(10); // default limit is 10
                });
                test("response body posts do not contain email and password", async () => {
                    for (const post of response.body.posts) {
                        expect(post.user.email).toBeFalsy();
                        expect(post.user.password).toBeFalsy();
                    }
                });
            });
        });
    });

    describe("database is empty", () => {
        let response;
        beforeAll(async () => response = await request(app).get("/api/posts"));
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
            expect(response.body.posts).toBeDefined();
            expect(Array.isArray(response.body.posts)).toBeTruthy();
            expect(response.body.posts.length).toEqual(0);
        });
    });
});
