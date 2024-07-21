// DOM Manipulation Functions
import {
    getAllRates,
    getHeaderList,
    getLastUpdate,
    refreshRatesAndDOM,
    setDefaultHeaderList,
    setHeaderList,
} from "./storage.js";
import { makeRequest, NBU_URL } from "./api.js";
import { getCookies, setCookies } from "./cookie.js";
import { getInputs, getSelectedOptions } from "./helpers.js";

export const setLastUpdateElement = (lastLocalUpdate) => {
    let lastUpdateElement = document.getElementById("latest-update");
    lastUpdateElement.textContent = lastLocalUpdate
        ? `Last update: ${lastLocalUpdate}`
        : `Last update: never`;
};

export const setCurrencyName = (allRates) => {
    let selects = document.getElementsByClassName("bid-currency");
    Array.from(selects).forEach((select) => {
        allRates.forEach((rate) => {
            let option = document.createElement("option");
            option.textContent = rate.txt;
            select.appendChild(option);
        });
    });
};

export const drawWidgets = async (widgets, headerList) => {
    if (headerList && headerList.length > 0) {
        console.log(headerList[0].txt);
        Array.from(widgets).forEach((elem, index) => {
            elem.textContent =
                `${headerList[index].txt} - ${headerList[index].rate.toFixed(2)}` || "";
        });
    } else {
        const response = await makeRequest(NBU_URL);
        let headerList = [];
        Array.from(widgets).forEach((elem, index) => {
            elem.textContent = `${response[index].txt} - ${response[index].rate.toFixed(2)}`;
            headerList.push(response[index]);
        });
        setDefaultHeaderList(headerList);
    }
};

export const drawHeaderDate = async () => {
    let widgets = document.getElementsByClassName("currency-widget");

    const headerList = getHeaderList();
    const lastUpdate = getLastUpdate();
    const allRates = getAllRates();

    if (!allRates || !lastUpdate) {
        await refreshRatesAndDOM();
    } else {
        setLastUpdateElement(getLastUpdate());
        setCurrencyName(getAllRates());
    }

    await drawWidgets(widgets, headerList);
};

export const getSelectedRate = (allRates, userSelectedCurrency) => {
    return allRates.filter(
        (item) =>
            item.txt ===
            userSelectedCurrency.options[userSelectedCurrency.selectedIndex].value,
    )[0];
};

export const calculateExchangeRate = (inputResult, outputResult, userInput) => {
    const CORRELATION = (inputResult.rate / outputResult.rate).toFixed(3);
    return (CORRELATION * userInput.value).toFixed(3);
};

export const calculateRate = (
    userInputCurrency,
    userOutputCurrency,
    userInput,
    userOutput,
) => {
    const allRates = getAllRates();
    const inputResult = getSelectedRate(allRates, userInputCurrency);
    const outputResult = getSelectedRate(allRates, userOutputCurrency);
    userOutput.value = calculateExchangeRate(
        inputResult,
        outputResult,
        userInput,
    );
    setHeaderList(inputResult, outputResult);
};

export const drawHistory = (historyList) => {
    let table = document.getElementById("history-table");
    let noHistoryElement = document.getElementById("no-history");
    table.innerHTML = "";
    if (historyList && historyList.length > 0) {
        historyList.forEach((item) => {
            let li = document.createElement("li");
            li.textContent = `${item.input} → ${item.output}`;
            table.appendChild(li);
        });
        table.classList.remove("hidden");
        noHistoryElement.classList.add("hidden");
    } else {
        table.classList.add("hidden");
        noHistoryElement.classList.remove("hidden");
    }
};

export const swapInputs = () => {
    const [userInput, userOutput] = getInputs();
    const [userInputCurrency, userOutputCurrency] = getSelectedOptions();

    [userInput.value, userOutput.value] = [userOutput.value, userInput.value];
    [userInputCurrency.selectedIndex, userOutputCurrency.selectedIndex] = [
        userOutputCurrency.selectedIndex,
        userInputCurrency.selectedIndex,
    ];
    setCookies(userInputCurrency.selectedIndex, userOutputCurrency.selectedIndex);
};

export const drawLastCurrency = () => {
    const [userInputCurrency, userOutputCurrency] = getSelectedOptions();
    const cookies = getCookies();
    if ("input" in cookies) {
        userInputCurrency.selectedIndex = cookies.input;
    }
    if ("output" in cookies) {
        userOutputCurrency.selectedIndex = cookies.output;
    }
};
