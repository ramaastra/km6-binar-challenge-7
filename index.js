require('./libs/sentry');

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const http = require('http');
const { Server } = require('socket.io');
const Sentry = require('@sentry/node');
const morgan = require('morgan');
const router = require('./router');
const pageRouter = require('./router/page.routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
  })
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'Server connected',
    data: null
  });
});

app.use('/api/v1', router);
app.use('/', pageRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: false,
    message: err.message,
    data: null
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: `${req.method} ${req.url} is not registered`,
    data: null
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

Sentry.setupExpressErrorHandler(app);

server.listen(port, () => {
  console.log(`Server is up and running at http://localhost:${port}`);
});
