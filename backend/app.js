const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');


mongoose.connect(`mongodb+srv://ugvgvvgvg:JMIn0VXTOxByByrE@cluster0.aaxuc3t.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() => console.log('Connection à MongoDB réussie'))
    .catch(() => console.log('Connection à MongoDB échouée'));

const app = express();    

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;