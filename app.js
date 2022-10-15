const express = require('express');
const path = require('path');
const app = express();
const db = require('./config/db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', require('./routes/userRoute'));
app.use('/books', require('./routes/bookRoute'));

db.sequelize.sync({ alter: false }); // If true Db will update every restart

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Server Connected'));
