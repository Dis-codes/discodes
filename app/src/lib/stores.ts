import { writable } from "svelte/store";
import { browser } from "$app/environment";

const getSettings = browser ? JSON.parse(window.localStorage.getItem("settings") ?? "{}") : {};
const InitSettings = {
	theme: "dark",
	tips: true,
	ads: true,
	privatePlugins: false,
	sortingMethod: "ascending",
	contentFiltering: "",
	timezone: "none"
};
export const user = writable<object>({});
export const settings = writable<object>(getSettings?.theme ? getSettings : InitSettings);

settings.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem("settings", JSON.stringify(value));
	}
});