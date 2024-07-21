export const setCookies = (input, output) => {
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `input=${encodeURIComponent(input)}; ${expires};`;
    document.cookie = `output=${encodeURIComponent(output)}; ${expires};`;
};

export const getCookies = () => {
    const cookiesMap = {};
    const cookies = document.cookie;

    cookies.replace(/([^=;\s]+)=([^;]*)/g, (match, name, value) => {
        cookiesMap[name] = decodeURIComponent(value);
        return match;
    });

    return cookiesMap;
};
