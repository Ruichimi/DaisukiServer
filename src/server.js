require('module-alias/register');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3333',
    credentials: true,
}));

app.use(require('./routes/auth'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
