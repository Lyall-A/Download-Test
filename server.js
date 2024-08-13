const net = require("net");
const fs = require("fs");

// const port = 8080;
const port = 6969;
const server = net.createServer();

const size = fs.lstatSync("download").size;

server.on("connection", socket => {
    socket.on("data", data => {
        const string = data.toString();
        if (string.startsWith(`GET / HTTP/1.1\r\n`)) {
            const connectDate = new Date();
            console.log(`[${connectDate.toLocaleString()}] Socket connected`);

            socket.write(`HTTP/1.1 200 OK\r\nContent-Disposition: attachment; filename="download-test-${connectDate.getTime()}"\r\nContent-Length: ${size}\r\n\r\n`);

            const stream = fs.createReadStream("download");
            stream.on("data", data => socket.write(data));
            stream.on("error", () => socket.destroy());
            stream.on("end", () => socket.end());

            socket.on("close", () => {
                const closeDate = new Date();
                console.log(`[${closeDate.toLocaleString()}] Socket closed, connected for ${new Date(closeDate.getTime() - connectDate.getTime()).toISOString().split(":").slice(1).join(":").split(".")[0]}`);
                stream.destroy();
            });
        } else socket.destroy();
    });

    socket.on("error", () => { });
});

server.listen(port, () => console.log(`Listening at :${port}`));