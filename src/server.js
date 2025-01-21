const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
const Registration = require('./services/auth/registration');

app.use(cors());

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

// app.get('/api/registration', async (req, res) => {
//     req.params.id;
// });
app.post('/api/registration', express.json(), async (req, res) => {
    const userdata = req.body;
    console.log(userdata);
    const reg = new Registration(userdata);
});

app.listen(port, async () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    // const userdata = {
    //     name: 'John',
    //     email: 'john.doe@example.com',
    //     password: '123456'
    // };
    //const reg = new Registration(userdata);
});
