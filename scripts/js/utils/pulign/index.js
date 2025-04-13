export const $ = (selector, parentElement = document) => {
    return parentElement.querySelector(selector);
};
export const $$ = (selector, parentElement = document) => {
    return parentElement.querySelectorAll(selector);
};
export const createElement = (tagName, className, content) => {
    const newElement = document.createElement(tagName);
    if (className)
        newElement.setAttribute("class", className);
    if (content)
        newElement.innerHTML = content;
    return newElement;
};
export const getTemplateFragment = (selector) => {
    const template = $(selector);
    return template?.content.cloneNode(true);
};
