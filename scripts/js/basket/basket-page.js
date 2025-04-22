import { $, $$, getTemplateFragment } from "../utils/pulign/index.js";
import basket from "./index.js";
import data from "../data/index.js";
import modal from "../modal.js";
const getElements = () => ({
    basketSection: $("#basket-section"),
    basketContainer: $("#basket-container"),
    basketBody: $("#basket-body"),
    basketFooter: $("#basket-footer"),
    clearBtn: $("#basket-clear-btn")
});
const updateBasketSectionClass = (isEmpty) => {
    const { basketSection } = getElements();
    if (!basketSection)
        return;
    basketSection.classList.toggle("basket--empty", isEmpty);
};
const renderBasketContent = (template) => {
    const { basketContainer } = getElements();
    if (!basketContainer)
        return;
    basketContainer.innerHTML = "";
    basketContainer.appendChild(template);
};
const clearBasket = () => {
    basket.clearBasket();
    renderBasketTemplate();
};
const updateBasketCountAndPrice = (parentEl) => {
    const countEl = $("#basket-count", parentEl);
    if (countEl) {
        countEl.innerHTML = `${basket.getTotalCount()} шт.`;
    }
    const priceEl = $("#basket-price", parentEl);
    if (priceEl) {
        priceEl.innerHTML = `${data.fetchProductsPrice(basket.getBasket())} ₽`;
    }
};
const renderBasketBoxItem = (basketItem, index, basketBody) => {
    const activeProduct = data.fetchProduct(basketItem.id);
    if (!activeProduct)
        return;
    const activeSize = activeProduct.sizes.find(item => item.key === basketItem.size) || null;
    const activeType = activeProduct.types.find(item => item.key === basketItem.type) || null;
    const basketBoxTemplate = getTemplateFragment("#basket-box-template");
    if (!basketBoxTemplate)
        return;
    basketBody.appendChild(basketBoxTemplate);
    const basketBoxes = $$(".basket__box");
    if (!basketBoxes.length)
        return;
    const activeBasketBox = basketBoxes[index];
    const setupBasketBoxContent = () => {
        const basketBoxName = $(".basket__box-name", activeBasketBox);
        if (basketBoxName)
            basketBoxName.innerHTML = activeProduct.name;
        const basketBoxImg = $(".basket__box-img", activeBasketBox);
        if (basketBoxImg) {
            basketBoxImg.src = `./assets/images/pizzas/pizza-${activeProduct.photo_id}.png`;
            basketBoxImg.alt = activeProduct.name;
        }
        if (activeSize && activeType) {
            const basketBoxDescription = $(".basket__box-description", activeBasketBox);
            if (basketBoxDescription) {
                basketBoxDescription.innerHTML = `${activeType.value}, ${activeSize.value} см.`;
            }
        }
    };
    const updateCountAndPrice = () => {
        const countEl = $(".basket__box-count", activeBasketBox);
        if (countEl)
            countEl.innerHTML = basket.getTotalCountById(basketItem.id).toString();
        const priceEl = $(".basket__box-price", activeBasketBox);
        if (priceEl) {
            const price = data.fetchProductsPrice([{ ...basketItem }]);
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
        const decrementBtn = $(".basket__box-decrement", activeBasketBox);
        if (decrementBtn) {
            decrementBtn.addEventListener("click", () => {
                basket.decreaseProductCount(basketItem.id, basketItem.size, basketItem.type);
                // Agar mahsulot soni 0 ga teng bo'lsa, elementni DOM dan o'chirish
                const newCount = basket.getTotalCountById(basketItem.id);
                if (newCount <= 0) {
                    removeElementFromDOM();
                }
                else {
                    updateCountAndPrice();
                }
                updateBasketCountAndPrice();
            });
        }
        const incrementBtn = $(".basket__box-increment", activeBasketBox);
        if (incrementBtn) {
            incrementBtn.addEventListener("click", () => {
                basket.addProduct(basketItem.id, basketItem.size, basketItem.type);
                updateCountAndPrice();
                updateBasketCountAndPrice();
            });
        }
        const clearBtn = $(".basket__box-clear", activeBasketBox);
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
const initializeBasketContent = () => {
    const { basketBody } = getElements();
    if (!basketBody)
        return;
    basketBody.innerHTML = "";
    basket.getBasket().forEach((basketItem, index) => {
        renderBasketBoxItem(basketItem, index, basketBody);
    });
};
const initializeBasketHtml = () => {
    const { clearBtn, basketFooter } = getElements();
    clearBtn?.addEventListener("click", clearBasket);
    initializeBasketContent();
    updateBasketCountAndPrice(basketFooter || undefined);
};
const renderBasketTemplate = () => {
    const count = basket.getTotalCount();
    const templateId = count ? "#basket-template" : "#basket-empty-template";
    const template = getTemplateFragment(templateId);
    if (template)
        renderBasketContent(template);
    updateBasketSectionClass(!count);
    if (count) {
        initializeBasketHtml();
        saveProduct();
    }
};
const saveProduct = () => {
    const saveProductBtn = $("#save-product-btn");
    if (!saveProductBtn)
        return;
    saveProductBtn.addEventListener("click", () => {
        handleSuccessModal();
    });
};
const handleSuccessModal = () => {
    const successModal = modal("#basket-success-modal");
    if (!successModal)
        return;
    successModal.openModal();
    setTimeout(() => {
        successModal.closeModal();
        clearBasket();
        window.location.replace("./");
    }, 2000);
};
document.addEventListener("DOMContentLoaded", renderBasketTemplate);
