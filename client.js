const net = require("net");

const config = require("./config.json");
const { port, filePath, speedIntervalTime, speedDiv } = config;

const client = net.createConnection({ host: "localhost", port });

let dataSize = 0;
let speed = 0;
let speedHistory = [];
let averageSpeed = speed;

let speedInterval;

console.log("Connecting to server");
client.on("connect", () => {
    console.log("Connected to server");
    client.write("GET / HTTP/1.1\r\n\r\n");
    speedInterval = setInterval(() => {
        speedHistory.push(speed);
        averageSpeed = speedHistory.reduce((prev, curr) => prev + curr) / speedHistory.length;
        console.log(`Speed: ${speed / speedDiv}, average speed: ${averageSpeed / speedDiv}`);
        speed = 0;
    }, speedIntervalTime);
});

client.on("data", i => {
    speed += i.byteLength;
    dataSize += i.byteLength;
});

client.on("error", err => {
    clearInterval(speedInterval);
    console.log(err);
    console.log(`Client errored, average speed: ${averageSpeed / speedDiv}, total size: ${dataSize}`);
});

client.on("end", () => {
    clearInterval(speedInterval);
    console.log(`Client ended, average speed: ${averageSpeed / speedDiv}, total size: ${dataSize}`);
});