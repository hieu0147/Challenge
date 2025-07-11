// server.js
const express = require('express');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const { swaggerUi, specs } = require('./swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/product', productRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
