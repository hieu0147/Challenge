// src/services/product.service.ts
import pool from '../db';
import { Product } from '../models/product.model';

export const getAllProducts = async (): Promise<Product[]> => {
    const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows;
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0] || null;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    const result = await pool.query('SELECT * FROM products WHERE slug = $1', [slug]);
    return result.rows[0] || null;
};

export const createProduct = async (name: string, slug: string, quantity: number): Promise<Product> => {
    const result = await pool.query(
        `INSERT INTO products (name, slug, quantity) VALUES ($1, $2, $3) RETURNING *`,
        [name, slug, quantity]
    );
    return result.rows[0];
};

export const updateProduct = async (id: string, name: string, slug: string, quantity: number): Promise<Product | null> => {
    const result = await pool.query(
        `UPDATE products SET name = $1, slug = $2, quantity = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *`,
        [name, slug, quantity, id]
    );
    return result.rows[0] || null;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
}; 