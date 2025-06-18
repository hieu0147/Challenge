const { body, validationResult } = require('express-validator');

exports.validateProductDTO = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 255 }).withMessage('Name too long'),

    body('slug')
        .notEmpty().withMessage('Slug is required')
        .isSlug().withMessage('Slug must be a valid slug'),

    body('quantity')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
