import { $ } from "./utils/pulign/index.js";
const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";
const spinner = document.createElement("div");
spinner.className = "spinner";
loadingScreen.appendChild(spinner);
document.body.appendChild(loadingScreen);
const appElement = $("#app");
appElement?.classList.add("hidden");
window.addEventListener("load", () => {
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
        appElement?.classList.remove("hidden");
        loadingScreen.remove();
    }, 200);
});
