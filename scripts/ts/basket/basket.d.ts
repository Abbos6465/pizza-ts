import {PRODUCT_DOUGH_TYPES, PRODUCT_SIZES} from "../data/data.enums";

export interface BasketItem {
    id: number;
    size: PRODUCT_SIZES;
    type: PRODUCT_DOUGH_TYPES;
    count: number;
}

export interface BasketObjType {
    map: Map<string, BasketItem>;
    readonly array: BasketItem[];
}