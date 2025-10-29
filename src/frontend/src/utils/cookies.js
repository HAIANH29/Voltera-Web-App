// Cookie utilities
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
};

// Create a Cookies object to mimic js-cookie library
export const Cookies = {
  get: getCookie,
  set: setCookie,
  remove: deleteCookie
};

export default Cookies;