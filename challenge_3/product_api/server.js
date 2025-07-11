// server.js
const express = require("express");
const app = express();

// Dòng này để parse body JSON:
app.use(express.json());

// Nếu bạn có route import
const productRouter = require("./routes/product");
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

