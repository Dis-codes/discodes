import { writable } from 'svelte/store';
import { browser } from '$app/environment';

let getSettings = browser ? JSON.parse(window.localStorage.getItem('settings') ?? '{}') : {}
let InitSettings = {
theme: "dark",
tips: true,
ads: true,
privatePlugins: false,
sortingMethod: 'default',
contentFiltering: [],
timezone: 'none'
}
export const user = writable<any>(null);
export const settings = writable<any>(getSettings?.theme ? getSettings : InitSettings);

settings.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('settings', JSON.stringify(value));
    }
})