import { writable} from "svelte/store";
import { browser } from "$app/environment";
import { setCookie, getCookie, cookieOptions } from "./cookieFunctions";
import {verifyJWT, createAndSignJWT} from "./jwt";

  const getSettings = browser
  ? JSON.parse(getCookie("settings") || "{}") : {};

export const user = writable<object>({});
export const supabaseClient = writable<object>({});
const settings = writable<object>(getSettings?.theme ? getSettings : {
	theme: "dark",
	tips: true,
	ads: true,
	privatePlugins: false,
	sortingMethod: "ascending",
	contentFiltering: "",
	timezone: "none"
  });

settings.subscribe(($settings) => {
	if (browser) {
	  setCookie("settings", JSON.stringify($settings), cookieOptions);
	}
  });
const getBotToken = browser ? getCookie("token") : "";
let getBotTokenVerified: string;
try{
	getBotTokenVerified = (await verifyJWT(getBotToken)).payload.value ?? "";
}catch(error){
	getBotTokenVerified = "";
}
const botToken = writable<string>(getBotTokenVerified);
botToken.subscribe(async ($botToken) => {
	if (browser && !$botToken) {
	  setCookie("token", "", cookieOptions);
	}
	if (browser && $botToken) {
	  try {
		let jwt = await createAndSignJWT($botToken);
		if (jwt === $botToken) return;
		setCookie("token", jwt, cookieOptions);
	  } catch (error) {
		console.error(error);
	  }
	}
  });
  
export { settings, botToken }