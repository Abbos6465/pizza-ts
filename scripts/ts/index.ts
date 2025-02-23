import {ModelType} from "./types";
import {$, $$, createElement} from "./utils/pulign.js";
import query from "./utils/query/query.js";

// ==> categories start <== //

const categoryNames = ["Мясные", "Вегетарианская", "Гриль", "Острые", "Закрытые"];

interface CategoryType extends Omit<ModelType, "id"> {
    id: "all" | number;
}

const categories: CategoryType[] = [
    {id: "all", name: "Все"},
    ...categoryNames.map((name, idx) => ({id: idx + 1, name}))
];

const categoryIdKey = "category_id";

const defaultCategoryId = "all";

let activeCategoryId: string | number = defaultCategoryId;

const setCategory = () => {
    const queryCategoryId = query.get({
        key: categoryIdKey,
        defaultValue: "all",
        type: "number"
    });

    activeCategoryId = queryCategoryId ?? defaultCategoryId;


    setCategoryBtns(".intro__filter-btns", categories);
};

const setCategoryBtns = (containerSelector: string, categories: CategoryType[]) => {
    const container = $<HTMLDivElement>(containerSelector);
    if (!container) return;

    const fragment = document.createDocumentFragment();

    categories.forEach(({id, name}) => {
        const btn = createElement<HTMLButtonElement>(
            "button",
            `intro__filter-btn btn ${id == activeCategoryId ? "btn--deep-gray" : "btn--light-gray"}`,
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
    activeCategoryId = parseId ?? defaultCategoryId;

    query.set(categoryIdKey, parseId);
};

// ==> categories end <== //


// ==> filters start <== //

const filterNames = ["популярности", "по цене", "по алфавиту"];

const filters: ModelType[] = filterNames.map((name, idx) => ({id: idx + 1, name}));

const filterIdKey = "filter_id";

const defaultFilterId = 1;

let activeFilterId: number = defaultFilterId;

const setFilterDropdown = () => {
    const dropdown = $<HTMLDivElement>(".dropdown");
    if (!dropdown) return;

    const dropdownBtn = $<HTMLButtonElement>(".dropdown-btn", dropdown);
    const dropdownMenu = $<HTMLUListElement>(".dropdown-menu", dropdown);

    if (!dropdownBtn || !dropdownMenu) return;

    const dropdownBtnActiveText = $<HTMLSpanElement>(".dropdown-btn__active-text", dropdownBtn);

    if (!dropdownBtnActiveText) return;

    // Sahifa yuklanganda filter_id ni query dan olish
    activeFilterId = query.get({
        key: filterIdKey,
        defaultValue: defaultFilterId,
        type: "number"
    }) as number;

    const updateActiveFilterText = () => {
        const activeFilter = filters.find(filter => filter.id === activeFilterId);
        if (activeFilter) dropdownBtnActiveText.textContent = activeFilter.name;
    };

    updateActiveFilterText();

    dropdownMenu.innerHTML = "";

    filters.forEach(({id, name}) => {
        const item = createElement<HTMLLIElement>("li", "dropdown-menu__item");
        const itemBtn = createElement<HTMLButtonElement>(
            "button",
            `dropdown-menu__btn ${activeFilterId === id ? "dropdown-menu__btn--active" : ""}`,
            name
        );
        itemBtn.dataset.id = String(id);

        itemBtn.addEventListener("click", () => {
            activeFilterId = id;
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