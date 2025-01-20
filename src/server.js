const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const path = require('path');
//const Registration = path.join(process.cwd(), 'database', 'connect.js');
const bcrypt = require('bcrypt');

app.use(cors());

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

// app.get('/api/registration', async (req, res) => {
//     req.params.id;
// });
app.post('/api/registration', express.json(), async (req, res) => {
    const data = req.body;
    console.log(data);
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
