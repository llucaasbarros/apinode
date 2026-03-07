const express = require('express');
const authMiddleware = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/order', authMiddleware, orderRoutes);

module.exports = app;
