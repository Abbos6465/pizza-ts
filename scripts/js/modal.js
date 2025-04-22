import { $ } from "./utils/pulign/index.js";
export default (selector) => {
    const bodyElement = $("body");
    const modalElement = $(selector);
    if (!modalElement || !bodyElement)
        return null;
    const toggleModal = (isOpen) => {
        modalElement.style.display = isOpen ? "block" : "";
        bodyElement.style.overflow = isOpen ? "hidden" : "";
    };
    return {
        openModal: () => toggleModal(true),
        closeModal: () => toggleModal(false)
    };
};
