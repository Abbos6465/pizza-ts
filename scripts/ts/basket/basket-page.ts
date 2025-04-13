import {$, getTemplateFragment} from "../utils/pulign/index.js";
import basket from "./index.js";
import data from "../data/index.js";

let count = basket.getTotalCount();

const updateBasketSectionClass = (isEmpty: boolean): void => {
    const basketSection = $("#basket-section");
    if (!basketSection) return;
    basketSection.classList.toggle("basket--empty", isEmpty);
};

const renderBasketContent = (template: DocumentFragment): void => {
    const basketContainer = $<HTMLDivElement>("#basket-container");
    if (!basketContainer) return;

    basketContainer.innerHTML = "";
    basketContainer.appendChild(template);
};

const clearBasket = (): void => {
    basket.clearBasket();
    count = 0;
    renderBasketTemplate();
};

const initializeBasketContent = (): void => {
    const basketBody = $<HTMLDivElement>("#basket-body");
    if (!basketBody) return;
    basketBody.innerHTML = "";
    basket.getBasket().forEach(basketItem => {
        const activeProduct = data.fetchProduct(basketItem.id);

        if (!activeProduct) return;
        const activeSize = activeProduct.sizes.find(item => item.key === basketItem.size) || null;
        const activeType = activeProduct.types.find(item => item.key === basketItem.type) || null;

        const basketBoxTemplate: DocumentFragment | null = getTemplateFragment("#basket-box-template");
        if (!basketBoxTemplate) return;

        const setBasketBoxName = () => {
            const basketBoxName = $<HTMLHeadingElement>(".basket__box-name", basketBoxTemplate);
            if (!basketBoxName) return;
            basketBoxName.innerHTML = activeProduct.name;
        };

        setBasketBoxName();

        const setBasketBoxImg = () => {
            const basketBoxImg = $<HTMLImageElement>(".basket__box-img", basketBoxTemplate);
            if (!basketBoxImg) return;
            basketBoxImg.src = `./assets/images/pizzas/pizza-${activeProduct.photo_id}.png`;
            basketBoxImg.alt = activeProduct.name;
        };

        setBasketBoxImg();

        const setBasketBoxDescription = () => {
            if (!activeSize || !activeType) return;
            const basketBoxDescription = $<HTMLParagraphElement>(".basket__box-description", basketBoxTemplate);
            if (!basketBoxDescription) return;
            basketBoxDescription.innerHTML = `${activeType.value}, ${activeSize.value} см.`;
        };

        setBasketBoxDescription();

        const setBasketItemCount = () => {
            const countEl = $<HTMLHeadingElement>(".basket__box-count");
            console.log(countEl);
            if (!countEl) return;
            countEl.innerHTML = basket.getTotalCountById(basketItem.id).toString();
        };

        const setBasketItemPrice = () => {
            const priceEl = $<HTMLHeadingElement>(".basket__box-price");
            if (!priceEl) return;
            const price = data.fetchProductsPrice([{...basketItem}]);
            priceEl.innerHTML = `${price} $`;
        };

        const updateCount = () => {
            const setupButtonHandler = (selector: string, action: () => void) => {
                const button = $<HTMLButtonElement>(selector, basketBoxTemplate);
                if (!button) return;

                button.addEventListener("click", () => {
                    action();
                    setBasketItemCount();
                    setBasketItemPrice();
                });
            };

            setupButtonHandler(
                ".basket__box-decrement",
                () => basket.decreaseProductCount(basketItem.id, basketItem.size, basketItem.type)
            );

            setupButtonHandler(
                ".basket__box-increment",
                () => basket.addProduct(basketItem.id, basketItem.size, basketItem.type)
            );
        };

        setBasketItemCount();
        setBasketItemPrice();
        updateCount();

        basketBody.appendChild(basketBoxTemplate);
    });
};


const initializeBasketHtml = (): void => {
    $<HTMLButtonElement>("#basket-clear-btn")?.addEventListener("click", () => {
        clearBasket();
    });

    initializeBasketContent();
};

const renderBasketTemplate = (): void => {
    const templateId = count ? "#basket-template" : "#basket-empty-template";
    const template = getTemplateFragment(templateId);

    if (template) renderBasketContent(template);

    updateBasketSectionClass(!count);

    if (count) initializeBasketHtml();
};

document.addEventListener("DOMContentLoaded", () => {
    renderBasketTemplate();
});