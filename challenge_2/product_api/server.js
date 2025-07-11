// server.js
const express = require('express');
require('dotenv').config();
const productRoutes = require('./routes/product');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/product', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
