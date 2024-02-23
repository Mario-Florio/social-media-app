
setupForumsCollection();

const ms = 0;

async function getForumMock(id) {
    await delay(ms);

    const forumsJSON = window.localStorage.getItem("Forums");
    const forums = JSON.parse(forumsJSON);

    let returnForum = null;
    forums.forEach(forum => {
        if (forum._id === id) {
            returnForum = forum;
        }
    })
    
    return returnForum;
}

export {
    getForumMock
};

// UTILS
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function setupForumsCollection() {
    const forums = [
        { _id: "1", posts: ["1", "2", "3"] },
        { _id: "2", posts: ["4", "5", "6"] },
        { _id: "3", posts: ["7", "8", "9", "10"] },
        { _id: "4", posts: [] },
        { _id: "5", posts: [] },
        { _id: "6", posts: [] },
        { _id: "7", posts: [] },
    ];

    window.localStorage.setItem("Forums", JSON.stringify(forums));
}
