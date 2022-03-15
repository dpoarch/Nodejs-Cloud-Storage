const {Storage} = require('@google-cloud/storage');

const storage = new Storage({
    keyFilename: "config/key.json",
 });


module.exports = storage;