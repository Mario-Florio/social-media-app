
function saveCollection(collection, { restoreHidden } = {}) {

    if ((collection.length > 0 && collection[0].username) &&
        restoreHidden === "password") {
        const usersJSON = window.localStorage.getItem("Users");
        const users = JSON.parse(usersJSON);

        for (const user of users) {
            if (user._id === collection._id && user.username === collection.username) {
                collection.password = user.password;
            }
        }
    }

    const collectionJSON = JSON.stringify(collection);
    window.localStorage.setItem(collectionJSON);
}

export default saveCollection;