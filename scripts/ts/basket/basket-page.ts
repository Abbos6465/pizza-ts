import {$, $$, getTemplateFragment} from "../utils/pulign/index.js";
import basket from "./index.js";
import data from "../data/index.js";
import {ParentElType} from "../utils/pulign/pulign";

const getElements = () => ({
    basketSection: $("#basket-section"),
    basketContainer: $<HTMLDivElement>("#basket-container"),
    basketBody: $<HTMLDivElement>("#basket-body"),
    basketFooter: $<HTMLDivElement>("#basket-footer"),
    clearBtn: $<HTMLButtonElement>("#basket-clear-btn")
});

const updateBasketSectionClass = (isEmpty: boolean): void => {
    const {basketSection} = getElements();
    if (!basketSection) return;
    basketSection.classList.toggle("basket--empty", isEmpty);
};

const renderBasketContent = (template: DocumentFragment): void => {
    const {basketContainer} = getElements();
    if (!basketContainer) return;

    basketContainer.innerHTML = "";
    basketContainer.appendChild(template);
};

const clearBasket = (): void => {
    basket.clearBasket();
    renderBasketTemplate();
};

const updateBasketCountAndPrice = (parentEl?: ParentElType) => {
    const countEl = $<HTMLDivElement>("#basket-count", parentEl);
    if (countEl) {
        countEl.innerHTML = `${basket.getTotalCount()} шт.`;
    }

    const priceEl = $("#basket-price", parentEl);

    if (priceEl) {
        priceEl.innerHTML = `${data.fetchProductsPrice(basket.getBasket())} ₽`;
    }
};

const renderBasketBoxItem = (basketItem: any, index: number, basketBody: HTMLDivElement): void => {
    const activeProduct = data.fetchProduct(basketItem.id);
    if (!activeProduct) return;

    const activeSize = activeProduct.sizes.find(item => item.key === basketItem.size) || null;
    const activeType = activeProduct.types.find(item => item.key === basketItem.type) || null;

    const basketBoxTemplate = getTemplateFragment("#basket-box-template");
    if (!basketBoxTemplate) return;

    basketBody.appendChild(basketBoxTemplate);
    const basketBoxes = $$<HTMLDivElement>(".basket__box");
    if (!basketBoxes.length) return;

    const activeBasketBox = basketBoxes[index];

    const setupBasketBoxContent = () => {
        const basketBoxName = $<HTMLHeadingElement>(".basket__box-name", activeBasketBox);
        if (basketBoxName) basketBoxName.innerHTML = activeProduct.name;

        const basketBoxImg = $<HTMLImageElement>(".basket__box-img", activeBasketBox);
        if (basketBoxImg) {
            basketBoxImg.src = `./assets/images/pizzas/pizza-${activeProduct.photo_id}.png`;
            basketBoxImg.alt = activeProduct.name;
        }

        if (activeSize && activeType) {
            const basketBoxDescription = $<HTMLParagraphElement>(".basket__box-description", activeBasketBox);
            if (basketBoxDescription) {
                basketBoxDescription.innerHTML = `${activeType.value}, ${activeSize.value} см.`;
            }
        }
    };

    const updateCountAndPrice = () => {
        const countEl = $<HTMLHeadingElement>(".basket__box-count", activeBasketBox);
        if (countEl) countEl.innerHTML = basket.getTotalCountById(basketItem.id).toString();

        const priceEl = $<HTMLHeadingElement>(".basket__box-price", activeBasketBox);
        if (priceEl) {
            const price = data.fetchProductsPrice([{...basketItem}]);
            priceEl.innerHTML = `${price} $`;
        }
    };

    // Element o'chirish funksiyasi
    const removeElementFromDOM = () => {
        if (activeBasketBox && activeBasketBox.parentNode) {
            activeBasketBox.parentNode.removeChild(activeBasketBox);

            // Agar savatcha bo'sh bo'lib qolsa, template'ni qayta renderlay qilish
            if (basket.getTotalCount() === 0) {
                renderBasketTemplate();
            }
        }
    };

    const setupButtons = () => {
        const decrementBtn = $<HTMLButtonElement>(".basket__box-decrement", activeBasketBox);
        if (decrementBtn) {
            decrementBtn.addEventListener("click", () => {
                basket.decreaseProductCount(basketItem.id, basketItem.size, basketItem.type);

                // Agar mahsulot soni 0 ga teng bo'lsa, elementni DOM dan o'chirish
                const newCount = basket.getTotalCountById(basketItem.id);
                if (newCount <= 0) {
                    removeElementFromDOM();
                } else {
                    updateCountAndPrice();
                }

                updateBasketCountAndPrice();
            });
        }

        const incrementBtn = $<HTMLButtonElement>(".basket__box-increment", activeBasketBox);
        if (incrementBtn) {
            incrementBtn.addEventListener("click", () => {
                basket.addProduct(basketItem.id, basketItem.size, basketItem.type);
                updateCountAndPrice();
                updateBasketCountAndPrice();
            });
        }

        const clearBtn = $<HTMLButtonElement>(".basket__box-clear", activeBasketBox);
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                basket.removeProductVariant(basketItem.id, basketItem.size, basketItem.type);
                removeElementFromDOM();
                updateBasketCountAndPrice();
            });
        }
    };

    setupBasketBoxContent();
    updateCountAndPrice();
    setupButtons();
};

const initializeBasketContent = (): void => {
    const {basketBody} = getElements();
    if (!basketBody) return;
    basketBody.innerHTML = "";

    basket.getBasket().forEach((basketItem, index) => {
        renderBasketBoxItem(basketItem, index, basketBody);
    });
};

const initializeBasketHtml = (): void => {
    const {clearBtn, basketFooter} = getElements();
    clearBtn?.addEventListener("click", clearBasket);
    initializeBasketContent();
    updateBasketCountAndPrice(basketFooter || undefined);
};

const renderBasketTemplate = (): void => {
    const count = basket.getTotalCount();
    const templateId = count ? "#basket-template" : "#basket-empty-template";
    const template = getTemplateFragment(templateId);

    if (template) renderBasketContent(template);
    updateBasketSectionClass(!count);
    if (count) initializeBasketHtml();
};

document.addEventListener("DOMContentLoaded", renderBasketTemplate);