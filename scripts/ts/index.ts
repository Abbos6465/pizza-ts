import {ModelType} from "./types";
import {$, $$, createElement} from "./utils/pulign.js";
import query from "./utils/query/query.js";
import data from "./data/index.js";

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

document.addEventListener("DOMContentLoaded", () => {
    setCategory();
    setFilterDropdown();
});