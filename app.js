const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const emitAddress = require('./issue_address.js');

const app = express();
const routes = require('./routes/index.js');

const main = require('./index.js');

const events = require('events');

// db settings

// settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 3000);

// middlewares
app.use((req, res, next) => {
	console.log(`${req.url} - ${req.method}`);
	next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// routes
app.use(routes);

// satic files
app.use(express.static(path.join(__dirname, 'public')));

// bootstraping the app
const server = app.listen(3000, () => console.log('server on port 3000'));

// websocket
const io = require('socket.io')(server,{'forceNew':true });

io.on('connection', (socket) => {
    socket.on("newview", async function() {
			var last3 = await main.last3().catch((error)=>{console.log(error);});
      socket.emit('last3', last3);
			marcador();
    });
		socket.on("getaddress", async function(data) {
			var adr = await emitAddress.emitAddress(data).catch((error)=>{console.log(error);});
			io.to(`${socket.id}`).emit('new', adr);
		});
		socket.on("searchtx", async function(data) {
			var data = await main.searchtx(data).catch((error)=>{console.log(error);});
			socket.emit('searchtx', data);
		});
		socket.on("actualice_txs", async function(data) {
			data[0] = await main.searchtx(data[0]).catch((error)=>{console.log(error);});
			socket.emit('actualiced_txs', [data[0], data[1], data[2]]);
		});
});

async function marcador(){
	var marcador = await main.marcador().catch((error)=>{console.log(error);});
	io.emit('marcador', marcador);
};
main.emitter.on("newblock", async function(data) {
	io.emit('newblock', data);
});
main.emitter.on("newbet", async function(data) {
	marcador();
	io.emit('newbet', data);
});
