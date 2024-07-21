import { makeRequest, NBU_URL } from "./api.js";
import { getUniqueList, updateHistoryList } from "./helpers.js";
import { setCurrencyName, setLastUpdateElement } from "./dom.js";

// Local Storage Functions
export const getHeaderList = () => {
    return JSON.parse(localStorage.getItem("headerList"));
};

export const getLastUpdate = () => {
    return localStorage.getItem("lastUpdate");
};

export const getAllRates = () => {
    return JSON.parse(localStorage.getItem("allRates"));
};

export const getLocalHistory = () => {
    return JSON.parse(localStorage.getItem("historyList"));
};

export const setHeaderList = (inputResult, outputResult) => {
    let headerList = getHeaderList() || [];

    const resultList = getUniqueList(headerList, inputResult, outputResult);
    console.log(resultList);
    localStorage.setItem("headerList", JSON.stringify(resultList));
};

export const setDefaultHeaderList = (headerList) => {
    localStorage.setItem("headerList", JSON.stringify(headerList));
};

export const setLastUpdate = () => {
    const currentDate = new Date().toLocaleString();
    localStorage.setItem("lastUpdate", currentDate);
};

export const setAllRates = async () => {
    const rates = await makeRequest(NBU_URL);
    localStorage.setItem("allRates", JSON.stringify(rates));
};

export const setLocalHistory = (input, output) => {
    let historyList = JSON.parse(localStorage.getItem("historyList")) || [];
    const updatedList = updateHistoryList(historyList, input, output);
    localStorage.setItem("historyList", JSON.stringify(updatedList));
};

export const refreshRatesAndDOM = async () => {
    await setAllRates();
    setLastUpdate();
    setLastUpdateElement(getLastUpdate());
    setCurrencyName(getAllRates());
};