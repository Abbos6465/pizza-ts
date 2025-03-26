import { $, $$, createElement } from "./utils/pulign.js";
import query from "./utils/query/query.js";
import data from "./data/index.js";
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
