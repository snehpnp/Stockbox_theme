
// module.exports = function (app, io) {
//     console.log("io",io);
//     return io
// }
let ioInstance;

module.exports = function (app, io) {
    if (!ioInstance) {
        // console.log("Initializing io instance...");
        ioInstance = io; // Save the io instance
    }
    return ioInstance;
};

module.exports.getIO = function () {
    if (!ioInstance) {
        throw new Error("Socket.IO instance is not initialized. Please initialize it first in app.js.");
    }
    return ioInstance;
};
