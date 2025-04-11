import {PRODUCT_DOUGH_TYPES, PRODUCT_SIZES} from "../data/data.enums";
import {getItem, setItem} from "../utils/localStorage.js";
import {BasketItem} from "./basket";

const basketStorageKey = "basket";

const loadBasketFromStorage = (): Map<string, BasketItem> => {
    const data = getItem(basketStorageKey);
    if (!data) return new Map();

    try {
        const parsed: Record<string, BasketItem> = JSON.parse(data);
        return new Map(Object.entries(parsed));
    } catch (error) {
        console.error("Basket JSON parse error:", error);
        return new Map();
    }
};

const basketData: Map<string, BasketItem> = loadBasketFromStorage();

const addProduct = (
    id: number,
    size: PRODUCT_SIZES,
    type: PRODUCT_DOUGH_TYPES
): void => {
    const key = `${id}_${size}_${type}`;

    if (!basketData.has(key)) {
        basketData.set(key, {id, size, type, count: 1});
    } else {
        const item = basketData.get(key)!;
        item.count++;
        basketData.set(key, item);
    }

    saveBasketToStorage();
};

const decreaseProductCount = (
    id: number,
    size: PRODUCT_SIZES,
    type: PRODUCT_DOUGH_TYPES
): void => {
    const key = `${id}_${size}_${type}`;

    if (basketData.has(key)) {
        const item = basketData.get(key)!;
        item.count--;

        if (item.count <= 0) {
            basketData.delete(key);
        } else {
            basketData.set(key, item);
        }

        saveBasketToStorage();
    }
};

const removeProductVariant = (
    id: number,
    size: PRODUCT_SIZES,
    type: PRODUCT_DOUGH_TYPES
): void => {
    const key = `${id}_${size}_${type}`;
    basketData.delete(key);
    saveBasketToStorage();
};

const removeProductById = (id: number): void => {
    for (const key of basketData.keys()) {
        if (key.startsWith(`${id}_`)) {
            basketData.delete(key);
        }
    }
    saveBasketToStorage();
};

const saveBasketToStorage = () => {
    const obj: Record<string, BasketItem> = Object.fromEntries(basketData.entries());
    setItem(basketStorageKey, JSON.stringify(obj));
};

const clearBasket = () => {
    basketData.clear();
    saveBasketToStorage();
};

const getTotalCountById = (id: number): number => {
    let total = 0;

    for (const [key, item] of basketData.entries()) {
        if (item.id === id) {
            total += item.count;
        }
    }

    return total;
};

export default {
    addProduct,
    decreaseProductCount,
    removeProductVariant,
    removeProductById,
    getBasket: () => basketData,
    clearBasket,
    getTotalCountById
};
