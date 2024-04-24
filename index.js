const http = require('http');
const app = require('./app');
require('dotenv').config();

const server = http.createServer(app);
const PORT = process.env.LOCAL_PORT;

server.listen(PORT, () => {
    console.log(`Server is now listening on http://localhost:${PORT}`)
})