import {GetQueryParamsType} from "./query.types";

export default {
    get: ({key, defaultValue = null, type = "string"}: GetQueryParamsType): string | number | null => {
        const activeQuery = new URLSearchParams(window.location.search).get(key);
        return activeQuery === null ? defaultValue : (type === "string" ? activeQuery : +activeQuery || defaultValue);
    },

    set: (key: string, value: any) => {
        const urlParams = new URLSearchParams(window.location.search);
        value ? urlParams.set(key, JSON.stringify(value)) : urlParams.delete(key);

        window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    }
};