const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8000;

// Create the server using the 'http' module
const server = http.createServer(app);

// Start the server and listen on the specified port
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
