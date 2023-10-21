const isDevelopment: boolean = import.meta.env.DEV;
export const setCookie = (name: string, value: string, options: CookieOptions) => {
    let cookieString = `${name}=${value || ""}`;
    if (options) {
      if (options.maxAge) cookieString += `; max-age=${options.maxAge}`;
      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.path) cookieString += `; path=${options.path}`;
      if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
      if (options.secure) cookieString += `; secure`;
    }
    document.cookie = cookieString;
  };
  
export const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };
  
  interface CookieOptions {
    domain?: string;
    maxAge?: number;
    path?: string;
    sameSite?: string;
    secure?: boolean;
  }
export const cookieOptions: CookieOptions = {
	domain: isDevelopment ? "localhost" : "discodes.xyz",
	maxAge: 60 * 60 * 24, // 1 day in seconds
	path: "/",
	sameSite: "lax",
	secure: !isDevelopment
  };