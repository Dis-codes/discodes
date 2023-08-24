import { writable } from 'svelte/store';
import { browser } from '$app/environment';


export const user = writable(null);
export const sessionStore = writable(null);
export const themeStore = writable<string>(browser ? window.localStorage.getItem('theme') ?? 'dark' : 'dark')

themeStore.subscribe((value) => {
    if (browser) {
        window.localStorage.setItem('theme',value)
    }
})