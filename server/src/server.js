const http = require('http');
const PORT = process.env.PORT || 8000;

const  app = require('./app');

const server = http.createServer(app);

function startServer(){
    server.listen(PORT, () => {
        console.log(`Listening to PORT ${PORT}...`);
    })
}


startServer();