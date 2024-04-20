const express = require('express');

const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
    res.json({ message: "hello server" });
})

app.listen(PORT, () => console.log(`Server is now listening on http://localhost:${PORT}`))