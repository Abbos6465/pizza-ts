import { getItem, setItem } from "../utils/localStorage.js";
const BASKET_STORAGE_KEY = "basket";
const createItemKey = (id, size, type) => `${id}_${size}_${type}`;
const loadBasketFromStorage = () => {
    const data = getItem(BASKET_STORAGE_KEY);
    if (!data)
        return new Map();
    try {
        const parsed = JSON.parse(data);
        return new Map(Object.entries(parsed));
    }
    catch (error) {
        console.error("Basket JSON parse error:", error);
        return new Map();
    }
};
const basketObj = {
    map: loadBasketFromStorage(),
    get array() {
        return Array.from(this.map.values());
    }
};
const saveBasketToStorage = () => {
    const obj = Object.fromEntries(basketObj.map.entries());
    setItem(BASKET_STORAGE_KEY, JSON.stringify(obj));
};
const addProduct = (id, size, type) => {
    const key = createItemKey(id, size, type);
    if (!basketObj.map.has(key)) {
        basketObj.map.set(key, { id, size, type, count: 1 });
    }
    else {
        const item = basketObj.map.get(key);
        item.count++;
    }
    saveBasketToStorage();
};
const decreaseProductCount = (id, size, type) => {
    const key = createItemKey(id, size, type);
    const item = basketObj.map.get(key);
    if (!item)
        return;
    item.count--;
    if (item.count <= 0) {
        basketObj.map.delete(key);
    }
    saveBasketToStorage();
};
const removeProductVariant = (id, size, type) => {
    const key = createItemKey(id, size, type);
    basketObj.map.delete(key);
    saveBasketToStorage();
};
const removeProductById = (id) => {
    const idPrefix = `${id}_`;
    for (const key of basketObj.map.keys()) {
        if (key.startsWith(idPrefix)) {
            basketObj.map.delete(key);
        }
    }
    saveBasketToStorage();
};
const clearBasket = () => {
    basketObj.map.clear();
    saveBasketToStorage();
};
const getTotalCountById = (id) => {
    let total = 0;
    for (const item of basketObj.map.values()) {
        if (item.id === id) {
            total += item.count;
        }
    }
    return total;
};
const getTotalCount = () => {
    let total = 0;
    for (const item of basketObj.map.values()) {
        total += item.count;
    }
    return total;
};
export default {
    addProduct,
    decreaseProductCount,
    removeProductVariant,
    removeProductById,
    getBasket: () => basketObj.array,
    clearBasket,
    getTotalCountById,
    getTotalCount
};
