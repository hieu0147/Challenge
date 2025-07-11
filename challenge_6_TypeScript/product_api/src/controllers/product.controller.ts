// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const getAllProducts = async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
};

export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
};

export const getProductBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
};

export const createProduct = async (req: Request, res: Response) => {
    const { name, slug, quantity } = req.body;
    try {
        const product = await productService.createProduct(name, slug, quantity);
        res.status(201).json({ success: true, data: product });
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: 'Slug sản phẩm đã tồn tại, vui lòng chọn slug khác.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, slug, quantity } = req.body;
    try {
        const product = await productService.updateProduct(id, name, slug, quantity);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({ success: true, data: product });
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: 'Slug sản phẩm đã tồn tại, vui lòng chọn slug khác.' });
        }
        res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
}; 