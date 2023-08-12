const Koa = require('koa');
const app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

// Serve static files (if needed)
app.use(require('koa-static')(__dirname + '/public'));

// Set up Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const port = process.env.PORT || 3003;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
