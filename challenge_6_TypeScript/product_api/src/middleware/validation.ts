// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Validation schemas
export const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải có định dạng hợp lệ',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

export const verifyOTPSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải có định dạng hợp lệ',
        'any.required': 'Email là bắt buộc'
    }),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
        'string.length': 'OTP phải có đúng 6 ký tự',
        'string.pattern.base': 'OTP chỉ được chứa số',
        'any.required': 'OTP là bắt buộc'
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email phải có định dạng hợp lệ',
        'any.required': 'Email là bắt buộc'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Mật khẩu là bắt buộc'
    })
});

export const productSchema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
        'string.empty': 'Tên sản phẩm không được để trống',
        'string.min': 'Tên sản phẩm phải có ít nhất 2 ký tự',
        'any.required': 'Tên sản phẩm là bắt buộc'
    }),
    slug: Joi.string().min(2).max(255).required().messages({
        'string.empty': 'Slug không được để trống',
        'any.required': 'Slug là bắt buộc'
    }),
    quantity: Joi.number().integer().min(0).required().messages({
        'number.base': 'Số lượng phải là số nguyên',
        'number.min': 'Số lượng phải >= 0',
        'any.required': 'Số lượng là bắt buộc'
    })
});

// Generic validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errorMessage
            });
        }

        next();
    };
};

// Specific validation middlewares
export const validateRegister = validate(registerSchema);
export const validateVerifyOTP = validate(verifyOTPSchema);
export const validateLogin = validate(loginSchema);
export const validateProduct = validate(productSchema); 