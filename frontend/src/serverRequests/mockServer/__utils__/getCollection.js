
function getCollection(collectionName) {
    const collectionJSON = window.localStorage.getItem(collectionName);
    const collection = JSON.parse(collectionJSON);
    return collection;
}

export default getCollection;