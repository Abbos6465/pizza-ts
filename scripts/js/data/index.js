import { PRODUCT_DOUGH_TYPES, PRODUCT_SIZES } from "./data.enums.js";
export const productSizes = [
    {
        key: PRODUCT_SIZES.SMALL,
        value: 26
    },
    {
        key: PRODUCT_SIZES.MEDIUM,
        value: 30
    },
    {
        key: PRODUCT_SIZES.LARGE,
        value: 40
    }
];
export const productDoughTypes = [
    {
        key: PRODUCT_DOUGH_TYPES.THING,
        value: "тонкое"
    },
    {
        key: PRODUCT_DOUGH_TYPES.TRADITIONAL,
        value: "традиционный"
    }
];
const categoryNames = ["Мясные", "Вегетарианская", "Гриль", "Острые", "Закрытые"];
const categories = categoryNames.map((name, idx) => ({ id: idx + 1, name }));
const filterNames = ["популярности", "по цене", "по алфавиту"];
const filters = filterNames.map((name, idx) => ({ id: idx + 1, name }));
export const products = [
    {
        id: 1,
        category_id: 1,
        photo_id: 1,
        name: "Чизбургер-пицца",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 395,
                [PRODUCT_SIZES.MEDIUM]: 420,
                [PRODUCT_SIZES.LARGE]: 450
            }
        }
    },
    {
        id: 2,
        category_id: 2,
        photo_id: 2,
        name: "Креветки по-азиатски",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 400,
                [PRODUCT_SIZES.MEDIUM]: 430,
                [PRODUCT_SIZES.LARGE]: 460
            }
        }
    },
    {
        id: 3,
        category_id: 3,
        photo_id: 3,
        name: "Сырная",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 450,
                [PRODUCT_SIZES.MEDIUM]: 480,
                [PRODUCT_SIZES.LARGE]: 500
            }
        }
    },
    {
        id: 4,
        category_id: 4,
        photo_id: 4,
        name: "Сырный цыпленок",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 422,
                [PRODUCT_SIZES.MEDIUM]: 455,
                [PRODUCT_SIZES.LARGE]: 470
            }
        }
    },
    {
        id: 5,
        category_id: 5,
        photo_id: 1,
        name: "Чизбургер-пицца 2",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 395,
                [PRODUCT_SIZES.MEDIUM]: 420,
                [PRODUCT_SIZES.LARGE]: 450
            }
        }
    },
    {
        id: 6,
        category_id: 1,
        photo_id: 2,
        name: "Креветки по-азиатски 2",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 400,
                [PRODUCT_SIZES.MEDIUM]: 430,
                [PRODUCT_SIZES.LARGE]: 460
            }
        }
    },
    {
        id: 7,
        category_id: 2,
        photo_id: 3,
        name: "Сырная",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 450,
                [PRODUCT_SIZES.MEDIUM]: 480,
                [PRODUCT_SIZES.LARGE]: 500
            }
        }
    },
    {
        id: 8,
        category_id: 3,
        photo_id: 4,
        name: "Сырный цыпленок",
        sizes: [...productSizes],
        types: [...productDoughTypes],
        prices: {
            [PRODUCT_DOUGH_TYPES.THING]: {
                [PRODUCT_SIZES.SMALL]: 422,
                [PRODUCT_SIZES.MEDIUM]: 455,
                [PRODUCT_SIZES.LARGE]: 470
            }
        }
    }
];
const fetchProducts = (params = {}) => {
    let responseProducts = [...products];
    // Filter by category if category_id is provided
    if (params.category_id) {
        responseProducts = responseProducts.filter(product => product.category_id === params.category_id);
    }
    // Sort products based on filter_id
    if (params.filter_id) {
        switch (params.filter_id) {
            case 1: // Popular (default sorting)
                responseProducts.sort((a, b) => a.id - b.id);
                break;
            case 2: // Sort by price (lowest to highest)
                responseProducts.sort((a, b) => {
                    // Get the lowest price across all dough types and sizes
                    const getLowestPrice = (product) => {
                        return Math.min(...Object.values(product.prices)
                            .flatMap(doughType => Object.values(doughType)));
                    };
                    return getLowestPrice(a) - getLowestPrice(b);
                });
                break;
            case 3: // Sort by name alphabetically
                responseProducts.sort((a, b) => a.name.localeCompare(b.name, "ru"));
                break;
        }
    }
    return responseProducts;
};
export default {
    categories,
    products,
    filters
};
