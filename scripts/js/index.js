import { $, $$, createElement } from "./utils/pulign.js";
import query from "./utils/query/query.js";
// ==> categories start <== //
const categoryNames = ["Мясные", "Вегетарианская", "Гриль", "Острые", "Закрытые"];
const categories = [
    { id: "all", name: "Все" },
    ...categoryNames.map((name, idx) => ({ id: idx + 1, name }))
];
const categoryIdKey = "category_id";
const defaultCategoryId = "all";
let activeCategoryId = defaultCategoryId;
const setCategory = () => {
    const queryCategoryId = query.get({
        key: categoryIdKey,
        defaultValue: "all",
        type: "number"
    });
    activeCategoryId = queryCategoryId !== null && queryCategoryId !== void 0 ? queryCategoryId : defaultCategoryId;
    setCategoryBtns(".intro__filter-btns", categories);
};
const setCategoryBtns = (containerSelector, categories) => {
    const container = $(containerSelector);
    if (!container)
        return;
    const fragment = document.createDocumentFragment();
    categories.forEach(({ id, name }) => {
        const btn = createElement("button", `intro__filter-btn btn ${id == activeCategoryId ? "btn--deep-gray" : "btn--light-gray"}`, name);
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
    activeCategoryId = parseId !== null && parseId !== void 0 ? parseId : defaultCategoryId;
    query.set(categoryIdKey, parseId);
};
// ==> categories end <== //
// ==> filters start <== //
const filterNames = ["популярности", "по цене", "по алфавиту"];
const filters = filterNames.map((name, idx) => ({ id: idx + 1, name }));
const filterIdKey = "filter_id";
const defaultFilterId = 1;
let activeFilterId = defaultFilterId;
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
    // Sahifa yuklanganda filter_id ni query dan olish
    activeFilterId = query.get({
        key: filterIdKey,
        defaultValue: defaultFilterId,
        type: "number"
    });
    const updateActiveFilterText = () => {
        const activeFilter = filters.find(filter => filter.id === activeFilterId);
        if (activeFilter)
            dropdownBtnActiveText.textContent = activeFilter.name;
    };
    updateActiveFilterText();
    dropdownMenu.innerHTML = "";
    filters.forEach(({ id, name }) => {
        const item = createElement("li", "dropdown-menu__item");
        const itemBtn = createElement("button", `dropdown-menu__btn ${activeFilterId === id ? "dropdown-menu__btn--active" : ""}`, name);
        itemBtn.dataset.id = String(id);
        itemBtn.addEventListener("click", () => {
            activeFilterId = id;
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
