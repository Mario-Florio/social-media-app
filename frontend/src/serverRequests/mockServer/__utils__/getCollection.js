
function getCollection(collectionName, { showHidden } = {}) {
    const collectionJSON = window.localStorage.getItem(collectionName);
    const collection = JSON.parse(collectionJSON);

    if (collectionName === "Users" && showHidden !== "password") {
        for (const user of collection) {
            delete user.password;
        }
    }

    return collection;
}

export default getCollection;