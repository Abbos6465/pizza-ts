import { $, $$, createElement } from "./utils/pulign.js";
import query from "./utils/query/query.js";
import data from "./data/index.js";
import basket from "./basket/index.js";
const categories = [
    { id: "all", name: "Все" },
    ...data.categories
];
const categoryIdKey = "category_id";
const defaultCategoryId = "all";
const activeCategory = {
    id: defaultCategoryId,
    get name() {
        return categories.find((category) => category.id === this.id)?.name || "";
    }
};
const setCategory = () => {
    const queryCategoryId = query.get({
        key: categoryIdKey,
        defaultValue: "all",
        type: "number"
    });
    activeCategory.id = queryCategoryId ?? defaultCategoryId;
    setActiveCategoryName();
    setCategoryBtns(".intro__filter-btns", categories);
};
const setActiveCategoryName = () => {
    const introTitle = $(".intro-title");
    if (!introTitle)
        return;
    introTitle.innerHTML = `${activeCategory.name} пиццы`;
};
const setCategoryBtns = (containerSelector, categories) => {
    const container = $(containerSelector);
    if (!container)
        return;
    const fragment = document.createDocumentFragment();
    categories.forEach(({ id, name }) => {
        const btn = createElement("button", `intro__filter-btn btn ${id === activeCategory.id ? "btn--deep-gray" : "btn--light-gray"}`, name);
        btn.dataset.id = String(id);
        btn.addEventListener("click", () => handleCategoryClick(btn, container));
        fragment.appendChild(btn);
    });
    container.appendChild(fragment);
};
const handleCategoryClick = (clickedBtn, container) => {
    $$(".intro__filter-btn", container).forEach(btn => {
        btn.classList.toggle("btn--deep-gray", btn === clickedBtn);
        btn.classList.toggle("btn--light-gray", btn !== clickedBtn);
    });
    changeCategory(clickedBtn.dataset.id);
};
const changeCategory = (id) => {
    if (!id)
        return;
    const parseId = +id || null;
    activeCategory.id = parseId ?? defaultCategoryId;
    setActiveCategoryName();
    fetchProducts();
    query.set(categoryIdKey, parseId);
};
// ==> categories end <== //
// ==> filters start <== //
const filterIdKey = "filter_id";
const defaultFilterId = 1;
const activeFilter = {
    id: defaultFilterId,
    get name() {
        return data.filters.find(filter => filter.id === this.id)?.name || "";
    }
};
const setFilterDropdown = () => {
    const dropdown = $(".dropdown");
    if (!dropdown)
        return;
    const dropdownBtn = $(".dropdown-btn", dropdown);
    const dropdownMenu = $(".dropdown-menu", dropdown);
    if (!dropdownBtn || !dropdownMenu)
        return;
    const dropdownBtnActiveText = $(".dropdown-btn__active-text", dropdownBtn);
    if (!dropdownBtnActiveText)
        return;
    // get filter id
    activeFilter.id = query.get({
        key: filterIdKey,
        defaultValue: defaultFilterId,
        type: "number"
    });
    const updateActiveFilterText = () => {
        dropdownBtnActiveText.textContent = activeFilter.name;
    };
    updateActiveFilterText();
    dropdownMenu.innerHTML = "";
    data.filters.forEach(({ id, name }) => {
        const item = createElement("li", "dropdown-menu__item");
        const itemBtn = createElement("button", `dropdown-menu__btn ${activeFilter.id === id ? "dropdown-menu__btn--active" : ""}`, name);
        itemBtn.dataset.id = String(id);
        itemBtn.addEventListener("click", () => {
            activeFilter.id = id;
            query.set(filterIdKey, id);
            $$(".dropdown-menu__btn", dropdownMenu).forEach(btn => {
                btn.classList.toggle("dropdown-menu__btn--active", btn === itemBtn);
            });
            updateActiveFilterText();
            fetchProducts();
            dropdown.classList.remove("dropdown--open");
        });
        item.appendChild(itemBtn);
        dropdownMenu.appendChild(item);
    });
    dropdownBtn.addEventListener("click", () => {
        dropdown.classList.toggle("dropdown--open");
    });
};
// ==> filters end <== //
// ==> products starts <== //
const fetchProducts = () => {
    const params = {
        filter_id: activeFilter.id
    };
    if (activeCategory.id !== defaultCategoryId)
        params.category_id = activeCategory.id;
    setProducts(data.fetchProducts(params));
    basket.getBasket();
};
const setProducts = (products) => {
    const dataWrapper = $(".intro-body");
    if (!dataWrapper)
        return;
    dataWrapper.innerHTML = "";
    const dataFragment = document.createDocumentFragment();
    products.forEach(product => {
        const productCard = createElement("div", "intro__card");
        const productImg = createElement("img", "intro__card-img");
        productImg.alt = product.name;
        productImg.src = `./assets/images/pizzas/pizza-${product.photo_id}.png`;
        productCard.appendChild(productImg);
        const productTitle = createElement("h6", "intro__card-title", product.name);
        productCard.appendChild(productTitle);
        const productCardBox = createElement("div", "intro__card__box");
        const productTypesWrap = createElement("div", "intro__card__box-grid intro__card__box-grid-column-2");
        product.types.forEach(type => {
            const typeBtn = createElement("button", "intro__card__box-btn", type.value);
            typeBtn.dataset.id = type.key;
            if (type.key === product.active_type) {
                typeBtn.classList.add("intro__card__box-btn--active");
            }
            typeBtn.addEventListener("click", () => {
                product.active_type = type.key;
                sizeOrTypeClick(typeBtn, productTypesWrap);
            });
            productTypesWrap.appendChild(typeBtn);
        });
        productCardBox.appendChild(productTypesWrap);
        const productSizesWrap = createElement("div", "intro__card__box-grid intro__card__box-grid-column-3");
        product.sizes.forEach(size => {
            const sizeBtn = createElement("button", "intro__card__box-btn", `${size.value} см.`);
            sizeBtn.dataset.id = size.key;
            if (size.key === product.active_size) {
                sizeBtn.classList.add("intro__card__box-btn--active");
            }
            sizeBtn.addEventListener("click", () => {
                product.active_size = size.key;
                sizeOrTypeClick(sizeBtn, productSizesWrap);
            });
            productSizesWrap.appendChild(sizeBtn);
        });
        const sizeOrTypeClick = (btn, container) => {
            const itemBtns = $$(".intro__card__box-btn", container);
            if (!itemBtns.length)
                return;
            itemBtns.forEach(itemBtn => {
                itemBtn.classList.toggle("intro__card__box-btn--active", btn === itemBtn);
            });
            setProductPrice();
        };
        productCardBox.appendChild(productSizesWrap);
        productCard.appendChild(productCardBox);
        const productFooter = createElement("div", "intro__card-footer");
        const productPriceText = createElement("strong", "intro__card-subtitle");
        const setProductPrice = () => {
            if (product.active_type && product.active_size) {
                const price = product.prices[product.active_type][product.active_size];
                productPriceText.innerHTML = price ? `от ${price} ₽` : "";
            }
        };
        setProductPrice();
        productFooter.appendChild(productPriceText);
        const productFooterBtn = createElement("button", "btn btn--outline intro__card__btn btn--small");
        // Create the SVG element
        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Set attributes for the SVG
        svgElement.setAttribute("class", "intro__card__btn-icon");
        svgElement.setAttribute("width", "12");
        svgElement.setAttribute("height", "12");
        svgElement.setAttribute("viewBox", "0 0 12 12");
        svgElement.setAttribute("fill", "none");
        svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        // Create the path element
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        // Set attributes for the path
        pathElement.setAttribute("d", "M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z");
        pathElement.setAttribute("fill", "#EB5A1E");
        // Append the path to the SVG
        svgElement.appendChild(pathElement);
        productFooterBtn.appendChild(svgElement);
        const productFooterBtnText = createElement("span", "intro__card__btn-text", "Добавить");
        const productFooterBtnCircle = createElement("span", "intro__card__btn__circle");
        productFooterBtn.appendChild(productFooterBtnText);
        productFooterBtn.appendChild(productFooterBtnCircle);
        const setSelectedProductCount = () => {
            const count = basket.getTotalCountById(product.id);
            if (count) {
                productFooterBtnCircle.textContent = String(count);
                productFooterBtnCircle.style.display = "inline-block";
                productFooterBtn.classList.add("intro__card__btn--active");
                productFooterBtn.classList.remove("btn--outline");
            }
            else {
                productFooterBtnCircle.style.display = "none";
            }
        };
        productFooterBtn.addEventListener("click", () => {
            if (product.active_size && product.active_type) {
                basket.addProduct(product.id, product.active_size, product.active_type);
                setBasketTotal();
            }
            setSelectedProductCount();
        });
        setSelectedProductCount();
        productFooter.appendChild(productFooterBtn);
        productCard.appendChild(productFooter);
        dataFragment.appendChild(productCard);
    });
    dataWrapper.appendChild(dataFragment);
};
const setBasketTotal = () => {
    const basketTotalBtn = $("#basket-total");
    if (!basketTotalBtn)
        return;
    const setBasketTotalPrice = () => {
        const basketTotalPriceEl = $("#basket-total-price", basketTotalBtn);
        if (!basketTotalPriceEl)
            return;
        const totalPrice = data.fetchProductsPrice(basket.getBasket());
        basketTotalPriceEl.innerHTML = `${totalPrice} ₽`;
    };
    const setBasketTotalCount = () => {
        const basketTotalCountEl = $("#basket-total-count", basketTotalBtn);
        if (!basketTotalCountEl)
            return;
        basketTotalCountEl.innerHTML = basket.getTotalCount().toString();
    };
    setBasketTotalPrice();
    setBasketTotalCount();
};
document.addEventListener("DOMContentLoaded", () => {
    setBasketTotal();
    setCategory();
    setFilterDropdown();
    fetchProducts();
});
