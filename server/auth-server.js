const WebSocket = require("ws");
const { createServer } = require("http");

const server = createServer();
const wsServer = new WebSocket.Server({
	server: server,
	path: "/websocket",
	verifyClient: validateClient,
});

const PORT = 5001;
const connections = {};

const handleMessage = (bytes, oi) => {
	const message = JSON.parse(bytes.toString());

	//TODO SOMENTE PARA TESTE
	if (message.type == "NOTIFICATION") {
		const dest = connections[message.dest];
		if (dest) {
			const msg = {
				type: "NOTIFICATION",
				payload: message.payload,
			};
			dest.send(JSON.stringify(msg));
		}
	}

	console.log(`MESSAGE FROM [${oi}]:${message}`);
};

const handleClose = (oi) => delete connections[oi];

function validateClient(connect) {
	//FIXME pegar o token
	const url = new URL("ws://url" + connect.req.url);
	const token = url.searchParams.get("token");

	if (!token) {
		return false;
	}

	//TODO get oi from token
	// if (token == '123Token') {
	//     connect.req.oi = '205000314.';
	//     return true
	// }

	if (token) {
		connect.req.oi = token;
		return true;
	}

	return false;
}

wsServer.on("connection", (connection, request) => {
	const oi = request.oi;
	connections[oi] = connection;

	console.info("Connected: ", oi);
	connection.on("message", (message) => handleMessage(message, oi));
	connection.on("close", () => handleClose(oi));
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
