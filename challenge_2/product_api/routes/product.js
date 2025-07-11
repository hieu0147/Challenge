// routes/product.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
});

// Tạo sản phẩm mới
router.post('/', async (req, res) => {
    const { name, slug, quantity } = req.body;
    const id = uuidv4();
    const result = await pool.query(
        `INSERT INTO products (id, name, slug, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, name, slug, quantity]
    );
    res.status(201).json(result.rows[0]);
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
});

// Lấy sản phẩm theo slug
router.get('/slug/:slug', async (req, res) => {
    const { slug } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
});

// Cập nhật sản phẩm
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, slug, quantity } = req.body;
    const result = await pool.query(
        `UPDATE products SET name = $1, slug = $2, quantity = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
        [name, slug, quantity, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
});

module.exports = router;
