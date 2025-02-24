import {ModelType} from "../types";

export enum PRODUCT_SIZES {
    SMALL = 26,
    MEDIUM = 30,
    LARGE = 40
}

export enum PRODUCT_DOUGH_TYPES {
    THING = "thing",
    TRADITIONAL = "traditional"
}

export interface ProductSizeType extends ModelType<PRODUCT_SIZES>{}

export interface ProductDoughType extends ModelType<PRODUCT_DOUGH_TYPES>{}

export interface ProductPriceType {
    [key in PRODUCT_DOUGH_TYPES]: {
        [size in PRODUCT_SIZES]: number;
    };
}

export interface ProductType extends ModelType<number> {
    category_id: number;
    photo: string;
    prices: ProductPriceType
}