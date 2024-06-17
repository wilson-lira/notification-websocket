const WebSocket = require('ws');

const ws = new WebSocket.Server({ port: 5001 });

ws.on('connection', function connection(socket) {
  console.log(ws.clients)
  console.log('Cliente conectado');

  socket.on('message', function incoming(message) {
    console.log('Mensagem recebida:', message);

    // Reenvia a mensagem para todos os clientes conectados
    ws.clients.forEach(function each(client) {
      if (client !== socket) {
        client.send(message);
      }
    });
  });

  socket.on('close', function close() {
    console.log('Cliente desconectado');
  });
});

console.log('server started')