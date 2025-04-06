import {ModelType} from "./types";
import {$, $$, createElement} from "./utils/pulign.js";
import query from "./utils/query/query.js";
import data from "./data/index.js";
import {FetchProductsParamsType, ProductType} from "./data/data.types";

// ==> categories start <== //

interface CategoryType extends Omit<ModelType, "id"> {
    id: "all" | number;
}

const categories: CategoryType[] = [
    {id: "all", name: "Все"},
    ...data.categories
];

const categoryIdKey = "category_id";

const defaultCategoryId = "all";

const activeCategory: ModelType<string | number> = {
    id: defaultCategoryId as number | string,
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
    const introTitle = $<HTMLHeadingElement>(".intro-title");
    if (!introTitle) return;
    introTitle.innerHTML = `${activeCategory.name} пиццы`;
};

const setCategoryBtns = (containerSelector: string, categories: CategoryType[]) => {
    const container = $<HTMLDivElement>(containerSelector);
    if (!container) return;

    const fragment = document.createDocumentFragment();

    categories.forEach(({id, name}) => {
        const btn = createElement<HTMLButtonElement>(
            "button",
            `intro__filter-btn btn ${id === activeCategory.id ? "btn--deep-gray" : "btn--light-gray"}`,
            name
        );
        btn.dataset.id = String(id);
        btn.addEventListener("click", () => handleCategoryClick(btn, container));
        fragment.appendChild(btn);
    });

    container.appendChild(fragment);
};

const handleCategoryClick = (clickedBtn: HTMLButtonElement, container: HTMLDivElement) => {
    $$<HTMLButtonElement>(".intro__filter-btn", container).forEach(btn => {
        btn.classList.toggle("btn--deep-gray", btn === clickedBtn);
        btn.classList.toggle("btn--light-gray", btn !== clickedBtn);
    });

    changeCategory(clickedBtn.dataset.id);
};

const changeCategory = (id?: string) => {
    if (!id) return;

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

const activeFilter: ModelType = {
    id: defaultFilterId,
    get name() {
        return data.filters.find(filter => filter.id === this.id)?.name || "";
    }
};

const setFilterDropdown = () => {
    const dropdown = $<HTMLDivElement>(".dropdown");
    if (!dropdown) return;

    const dropdownBtn = $<HTMLButtonElement>(".dropdown-btn", dropdown);
    const dropdownMenu = $<HTMLUListElement>(".dropdown-menu", dropdown);

    if (!dropdownBtn || !dropdownMenu) return;

    const dropdownBtnActiveText = $<HTMLSpanElement>(".dropdown-btn__active-text", dropdownBtn);

    if (!dropdownBtnActiveText) return;

    // get filter id
    activeFilter.id = query.get({
        key: filterIdKey,
        defaultValue: defaultFilterId,
        type: "number"
    }) as number;

    const updateActiveFilterText = () => {
        dropdownBtnActiveText.textContent = activeFilter.name;
    };

    updateActiveFilterText();

    dropdownMenu.innerHTML = "";

    data.filters.forEach(({id, name}) => {
        const item = createElement<HTMLLIElement>("li", "dropdown-menu__item");
        const itemBtn = createElement<HTMLButtonElement>(
            "button",
            `dropdown-menu__btn ${activeFilter.id === id ? "dropdown-menu__btn--active" : ""}`,
            name
        );
        itemBtn.dataset.id = String(id);

        itemBtn.addEventListener("click", () => {
            activeFilter.id = id;
            query.set(filterIdKey, id);

            $$<HTMLButtonElement>(".dropdown-menu__btn", dropdownMenu).forEach(btn => {
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
    const params: FetchProductsParamsType = {
        filter_id: activeFilter.id
    };
    if (activeCategory.id !== defaultCategoryId) params.category_id = activeCategory.id as number;
    setProducts(data.fetchProducts(params));
};

const setProducts = (products: ProductType[]) => {
    const dataWrapper = $<HTMLDivElement>(".intro-body");
    if (!dataWrapper) return;
    dataWrapper.innerHTML = "";

    const dataFragment = document.createDocumentFragment();

    products.forEach(product => {
        const productCard = createElement<HTMLDivElement>("div", "intro__card");

        const productImg = createElement<HTMLImageElement>("img", "intro__card-img");
        productImg.alt = product.name;
        productImg.src = `./assets/images/pizzas/pizza-${product.photo_id}.png`;

        productCard.appendChild(productImg);

        const productTitle = createElement<HTMLHeadingElement>("h6", "intro__card-title", product.name);
        productCard.appendChild(productTitle);

        const productCardBox = createElement<HTMLDivElement>("div", "intro__card__box");

        const productTypesWrap = createElement<HTMLDivElement>("div", "intro__card__box-grid intro__card__box-grid-column-2");
        product.types.forEach(type => {
            const typeBtn = createElement<HTMLButtonElement>("button", "intro__card__box-btn", type.value);
            typeBtn.dataset.id = type.key;
            if (type.value === product.active_type) {
                typeBtn.classList.add("intro__card__box-btn--active");
            }
            typeBtn.addEventListener("click", () => {
                product.active_type = type.value;
            });
            productTypesWrap.appendChild(typeBtn);
        });
        productCardBox.appendChild(productTypesWrap);

        const productSizesWrap = createElement<HTMLDivElement>("div", "intro__card__box-grid intro__card__box-grid-column-3");

        product.sizes.forEach(size => {
            const sizeBtn = createElement<HTMLButtonElement>("button", "intro__card__box-btn", `${size.value} см.`);
            sizeBtn.dataset.id = size.key;
            if (size.value === product.active_size) {
                sizeBtn.classList.add("intro__card__box-btn--active");
            }
            sizeBtn.addEventListener("click", () => {
                product.active_size = size.value;
            });
            productSizesWrap.appendChild(sizeBtn);
        });
        productCardBox.appendChild(productSizesWrap);

        productCard.appendChild(productCardBox);

        const productFooter = createElement<HTMLDivElement>("div", "intro__card-footer");
        const productPrice = createElement("strong", "intro__card-subtitle", `от ${0} ₽`);

        dataFragment.appendChild(productCard);
    });

    dataWrapper.appendChild(dataFragment);
};

document.addEventListener("DOMContentLoaded", () => {
    setCategory();
    setFilterDropdown();
    fetchProducts();
});