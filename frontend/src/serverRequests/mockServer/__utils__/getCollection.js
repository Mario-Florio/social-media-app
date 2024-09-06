
function getCollection(collectionName, { showHidden=[] } = {}) {
    const collectionJSON = window.localStorage.getItem(collectionName);
    const collection = JSON.parse(collectionJSON);

    if (collectionName === "Users") {
        let hideEmail = true;
        let hidePassword = true;

        if (showHidden.includes("email")) hideEmail = false;
        if (showHidden.includes("password")) hidePassword = false;

        for (const user of collection) {
            hideEmail && delete user.email;
            hidePassword && delete user.password;
        }
    }

    return collection;
}

export default getCollection;