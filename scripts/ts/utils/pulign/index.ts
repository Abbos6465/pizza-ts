import {ParentElType, SelectorType} from "./pulign";

export const $ = <T extends HTMLElement>(
    selector: SelectorType,
    parentElement: ParentElType = document
): T | null => {
    return parentElement.querySelector(selector);
};

export const $$ = <T extends HTMLElement>(
    selector: SelectorType,
    parentElement: ParentElType = document
): NodeListOf<T> => {
    return parentElement.querySelectorAll(selector);
};

export const createElement = <T extends HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    className?: string,
    content?: any
): T => {
    const newElement = document.createElement(tagName) as T;
    if (className) newElement.setAttribute("class", className);
    if (content) newElement.innerHTML = content;
    return newElement;
};

export const getTemplateFragment = (selector: string): DocumentFragment | null => {
    const template = $<HTMLTemplateElement>(selector);
    return template?.content.cloneNode(true) as DocumentFragment | null;
};