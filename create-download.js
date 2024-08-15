const fs = require("fs");
const { randomBytes } = require("crypto");

const config = require("./config.json");
const { createDownloadMultiplier } = config;

const useRandomBytes = process.argv[2] == "random" ? true : false;
const size = parseFloat(process.argv[3]) * createDownloadMultiplier || 1024 * 1024 * 1024 * 1; // Size in bytes

const maxSize = 2**31-1;

console.log(`Starting to write ${size} bytes...`);

const stream = fs.createWriteStream("download");

for (let length = 0; length < size;) {
    const sizeToWrite = Math.min(size - length, maxSize);
    length += sizeToWrite;
    stream.write(useRandomBytes ? randomBytes(sizeToWrite) : Buffer.alloc(sizeToWrite).fill(0xFF));
    console.log(`Written ${sizeToWrite} bytes, ${length} bytes total`);
}

console.log("Done! Ending stream...");
stream.end();
