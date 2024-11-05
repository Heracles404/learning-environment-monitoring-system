const path = require('path');
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users/users.router');
const sensorsRouter = require('./routes/sensors/sensors.router');

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
}));

app.use(express.json());

app.use('/users', usersRouter);
app.use('/sensors', sensorsRouter);

// Add this route to handle httpGetAllReadouts
app.get('/httpGetAllReadouts', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('http://localhost:8000/sensors');
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch readouts' });
    }
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            res.status(404).send('index.html not found');
        }
    });
});

module.exports = app;
