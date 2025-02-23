export const $ = <T extends HTMLElement>(
    selector: string,
    parentElement: HTMLElement | Document = document
): T | null => {
    return parentElement.querySelector(selector);
};

export const $$ = <T extends HTMLElement>(
    selector: string,
    parentElement: HTMLElement | Document = document
): NodeListOf<T> => {
    return parentElement.querySelectorAll(selector);
};

export const createElement = <T extends HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    className?: string,
    content?: string
): T => {
    const newElement = document.createElement(tagName) as T;
    if (className) newElement.setAttribute("class", className);
    if (content) newElement.innerHTML = content;
    return newElement;
};