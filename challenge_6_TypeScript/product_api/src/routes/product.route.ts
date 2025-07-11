// src/routes/product.route.ts
import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validateProduct } from '../middleware/validation';
import { authorize } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication
 *   - name: Product
 *     description: Product management
 */

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string, example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef' }
 *                       name: { type: string, example: 'Áo thun nam' }
 *                       slug: { type: string, example: 'ao-thun-nam' }
 *                       quantity: { type: integer, example: 100 }
 *                       created_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *                       updated_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, quantity]
 *             properties:
 *               name: { type: string, example: 'Áo thun nam' }
 *               slug: { type: string, example: 'ao-thun-nam' }
 *               quantity: { type: integer, example: 100 }
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef' }
 *                     name: { type: string, example: 'Áo thun nam' }
 *                     slug: { type: string, example: 'ao-thun-nam' }
 *                     quantity: { type: integer, example: 100 }
 *                     created_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *                     updated_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: 'Error message' }
 */
router.post('/', authorize, validateProduct, productController.createProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product id
 *     responses:
 *       200:
 *         description: Sản phẩm tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef' }
 *                     name: { type: string, example: 'Áo thun nam' }
 *                     slug: { type: string, example: 'ao-thun-nam' }
 *                     quantity: { type: integer, example: 100 }
 *                     created_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *                     updated_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: 'Product not found' }
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/product/slug/{slug}:
 *   get:
 *     summary: Lấy sản phẩm theo slug
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Sản phẩm tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef' }
 *                     name: { type: string, example: 'Áo thun nam' }
 *                     slug: { type: string, example: 'ao-thun-nam' }
 *                     quantity: { type: integer, example: 100 }
 *                     created_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *                     updated_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: 'Product not found' }
 */
router.get('/slug/:slug', productController.getProductBySlug);

/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, quantity]
 *             properties:
 *               name: { type: string, example: 'Áo thun nam' }
 *               slug: { type: string, example: 'ao-thun-nam' }
 *               quantity: { type: integer, example: 100 }
 *     responses:
 *       200:
 *         description: Sản phẩm đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string, example: 'b1a2c3d4-e5f6-7890-abcd-1234567890ef' }
 *                     name: { type: string, example: 'Áo thun nam' }
 *                     slug: { type: string, example: 'ao-thun-nam' }
 *                     quantity: { type: integer, example: 100 }
 *                     created_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *                     updated_at: { type: string, format: date-time, example: '2024-06-01T12:00:00Z' }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: 'Error message' }
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: 'Product not found' }
 */
router.put('/:id', authorize, validateProduct, productController.updateProduct);

/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Xóa sản phẩm
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product id
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Product deleted successfully' }
 *       404:
 *         description: Không tìm thấy sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: 'Product not found' }
 */
router.delete('/:id', authorize, productController.deleteProduct);

export default router; 