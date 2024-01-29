const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connect() {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
}

async function disconnect(mongoServer) {
    await mongoose.disconnect();
    await mongoose.connection.close();
}

async function dropCollections(mongoServer) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.drop();
    }
}

module.exports = {
    connect,
    disconnect,
    dropCollections
};