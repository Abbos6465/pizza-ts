import {$} from "./utils/pulign/index.js";


export default (selector: string) => {
    const bodyElement = $<HTMLBodyElement>("body");
    const modalElement = $<HTMLDivElement>(selector);

    if (!modalElement || !bodyElement) return null;

    const toggleModal = (isOpen: boolean) => {
        modalElement.style.display = isOpen ? "block" : "";
        bodyElement.style.overflow = isOpen ? "hidden" : "";
    };

    return {
        openModal: () => toggleModal(true),
        closeModal: () => toggleModal(false)
    };
}