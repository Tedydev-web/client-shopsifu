import { BaseEntity, PaginationMetadata } from "./base.interface";

/**
 * @interface Variant
 * @description Represents a product variant attribute, like 'Color' or 'Size'.
 */
export interface Variant {
    value: string;
    options: string[];
}

/**
 * @interface Sku
 * @description Represents a specific stock keeping unit, a unique combination of variants.
 */
export interface Sku {
    value: string;
    price: number;
    stock: number;
    image: string;
}

/**
 * @interface ProductTranslation
 * @description Represents the translation of a product's text fields into a specific language.
 */
export interface ProductTranslation extends BaseEntity {
    productId: number;
    languageCode: string;
    name: string;
    description: string;
}

/**
 * @interface Product
 * @description Represents the main product entity, extending the base entity.
 */
export interface Product extends BaseEntity {
    publishedAt: string | null;
    name: string;
    basePrice: number;
    virtualPrice: number;
    brandId: number;
    images: string[];
    variants: Variant[];
    skus?: Sku[]; // Optional as it's not in the list response
    categories?: number[]; // Optional as it's not in the list response
    productTranslations: ProductTranslation[];
}

/**
 * @interface ProductsResponse
 * @description Represents the API response for a list of products, including pagination metadata.
 */
export interface ProductsResponse {
    data: Product[];
    metadata: PaginationMetadata;
}