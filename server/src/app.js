const path = require('path');
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users/users.router')
const sensorsRouter = require('./routes/sensors/sensors.router')

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
}));


const publicPath = path.resolve(__dirname, "..", "..", "client", "build");

app.use(express.static(publicPath));
app.get('/*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
})

app.use(express.json());

app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);

module.exports = app;




