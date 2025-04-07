import {ModelType, ModelType2} from "../types";
import {PRODUCT_DOUGH_TYPES, PRODUCT_SIZES} from "./data.enums";


export interface ProductSizeType extends ModelType2<PRODUCT_SIZES, number> {
}

export interface ProductDoughType extends ModelType2<PRODUCT_DOUGH_TYPES, string> {
}

export type ProductPriceType = {
    [doughType in PRODUCT_DOUGH_TYPES]?: {
        [size in PRODUCT_SIZES]: number;
    };
};

export interface ProductCategoryType extends ModelType {
}

export interface ProductType extends ModelType<number> {
    category_id: number;
    photo_id: number;
    sizes: ProductSizeType[],
    types: ProductDoughType[],
    active_size?: PRODUCT_SIZES;
    active_type?: PRODUCT_DOUGH_TYPES;
    prices: ProductPriceType
}

export interface FetchProductsParamsType {
    category_id?: number;
    filter_id?: number;
}