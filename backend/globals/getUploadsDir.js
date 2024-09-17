
function getUploadsDir() {
    return process.env.UPLOADS || "./uploads/";
}

module.exports = getUploadsDir;