const net = require("net");
const fs = require("fs");

const config = require("./config.json");
const { port, filePath } = config;

const server = net.createServer();

server.on("connection", socket => {
    const downloadSize = fs.lstatSync(filePath).size;

    socket.on("data", data => {
        const string = data.toString();

        if (string.startsWith(`GET / HTTP/1.1\r\n`)) {
            const connectDate = new Date();
            console.log(`[${connectDate.toLocaleString()}] Socket connected`);

            socket.write(`HTTP/1.1 200 OK\r\nContent-Disposition: attachment; filename="download-test-${connectDate.getTime()}"\r\nContent-Length: ${downloadSize}\r\n\r\n`);

            const stream = fs.createReadStream(filePath);
            stream.on("data", data => socket.write(data));
            stream.on("error", () => socket.end());
            stream.on("end", () => socket.end());

            socket.on("close", () => {
                const closeDate = new Date();
                console.log(`[${closeDate.toLocaleString()}] Socket closed, connected for ${new Date(closeDate.getTime() - connectDate.getTime()).toISOString().split(":").slice(1).join(":").split(".")[0]}`);
                stream.destroy();
            });
        } else socket.end();
    });

    socket.on("error", () => { });
});

server.listen(port, () => console.log(`Listening at :${port}`));