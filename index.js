//required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

const urlEnconder = bodyParser.urlencoded({ extended: false });

//required route modules
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/post');
const categoryRoute = require('./routes/categories');

dotenv.config();

app.use(express.json());
app.use(bodyParser.json(), urlEnconder);
app.use('/images', express.static(path.join(__dirname, '/images')));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(console.log('Connected to the mongoDB'))
  .catch((err) => console.log(err));

//path routing
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRoute);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

//server running in backend
app.listen(process.env.PORT || 5000, () =>
  console.log('Server is started... ')
);
