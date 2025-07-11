// src/models/product.model.ts

export interface Product {
    id: string;
    name: string;
    slug: string;
    quantity: number;
    created_at: Date;
    updated_at: Date;
} 