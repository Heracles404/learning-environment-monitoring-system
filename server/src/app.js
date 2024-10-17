const path = require('path');
const express = require('express');

const usersRouter = require('./routes/users/users.router')
const sensorsRouter = require('./routes/sensors/sensors.router')

const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);

module.exports = app;


// Add this lines when Connecting Back end and front end
// const cors = require('cors');
// const publicPath = path.resolve(__dirname, "..", "..", "client", "build");
// app.use(cors({
//     origin: "http://localhost:3000",
// }));
// app.use(express.static(publicPath));
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(publicPath, 'index.html'));
// })

