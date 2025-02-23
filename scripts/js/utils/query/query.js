export default {
    get: ({ key, defaultValue = null, type = "string" }) => {
        const activeQuery = new URLSearchParams(window.location.search).get(key);
        return activeQuery === null ? defaultValue : (type === "string" ? activeQuery : +activeQuery || defaultValue);
    },
    set: (key, value) => {
        const urlParams = new URLSearchParams(window.location.search);
        value ? urlParams.set(key, JSON.stringify(value)) : urlParams.delete(key);
        window.history.pushState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    }
};
