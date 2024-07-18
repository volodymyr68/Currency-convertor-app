const NBU_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

const getCurrencyRate = async (NBU_URL) => {
    try {
        const response = await fetch(NBU_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}

const getHeaderList = () => {
    return JSON.parse(localStorage.getItem("headerList"));
}

const getLastUpdate = () => {
    return localStorage.getItem("lastUpdate");
}

const getAllRates = () => {
    const rates = localStorage.getItem("allRates");
    return rates ? JSON.parse(rates) : null;
}

const updateLastUpdateElement = (lastLocalUpdate) => {
    let lastUpdateElement = document.getElementById("latest-update");
    lastUpdateElement.textContent = lastLocalUpdate ? `Last update: ${lastLocalUpdate}` : `Last update: never`;
}

const setCurrencyOptions = (selectElements, rates) => {
    Array.from(selectElements).forEach(select => {
        select.innerHTML = '';  // Clear existing options
        rates.forEach(rate => {
            let option = document.createElement("option");
            option.textContent = rate.txt;
            select.appendChild(option);
        });
    });
}

const setCurrencyName = (allRates) => {
    let selects = document.getElementsByClassName("bid-currency");
    setCurrencyOptions(selects, allRates);
}

const isValid = (value) => {
    return !isNaN(value) && value.trim() !== "";
}

const setLocalRates = async () => {
    const rates = await getCurrencyRate(NBU_URL);
    if (!rates) return;
    const currentDate = new Date().toLocaleString();
    localStorage.setItem("allRates", JSON.stringify(rates));
    localStorage.setItem("lastUpdate", currentDate);
    updateLastUpdateElement(currentDate);
    setCurrencyName(getAllRates());
}

const drawWidgets = async (widgets, headerList) => {
    if (headerList && headerList.length > 0) {
        Array.from(widgets).forEach((elem, index) => {
            elem.textContent = `${headerList[index].txt} - ${headerList[index].rate.toFixed(2)}` || '';
        });
    } else {
        try {
            const response = await getCurrencyRate(NBU_URL);
            if (!response) return;
            let headerList = [];
            Array.from(widgets).forEach((elem, index) => {
                elem.textContent = `${response[index].txt} - ${response[index].rate.toFixed(2)}`;
                headerList.push(response[index]);
            });
            localStorage.setItem("headerList", JSON.stringify(headerList));
        } catch (error) {
            console.error('Error fetching currency rates:', error);
        }
    }
}

const drawHeaderDate = async () => {
    let widgets = document.getElementsByClassName("currency-widget");

    const headerList = getHeaderList();
    const lastUpdate = getLastUpdate();
    const allRates = getAllRates();

    if (!allRates || !lastUpdate) {
        await setLocalRates();
    } else {
        updateLastUpdateElement(lastUpdate);
        setCurrencyName(allRates);
    }

    drawWidgets(widgets, headerList);
};

const calculateRate = (rate, userInputCurrency, userOutputCurrency, userInput, userOutput) => {
    const allRates = getAllRates();
    if (!allRates) return;
    const inputResult = allRates.find(item => item.txt === userInputCurrency.options[userInputCurrency.selectedIndex].value);
    const outputResult = allRates.find(item => item.txt === userOutputCurrency.options[userOutputCurrency.selectedIndex].value);
    if (!inputResult || !outputResult) return;
    const CORRELATION = (inputResult.rate / outputResult.rate).toFixed(3);
    userOutput.value = (CORRELATION * rate).toFixed(3);
    let headerList = getHeaderList() || [];
    headerList.slice(2);
    headerList.unshift(inputResult, outputResult);
    localStorage.setItem("headerList", JSON.stringify(headerList));
}

const swapInputs = () => {
    let userInput = document.getElementById("user-input");
    let userOutput = document.getElementById("user-output");
    let userInputCurrency = document.getElementById("user-input-currency");
    let userOutputCurrency = document.getElementById("user-output-currency");

    [userInput.value, userOutput.value] = [userOutput.value, userInput.value];
    [userInputCurrency.selectedIndex, userOutputCurrency.selectedIndex] = [userOutputCurrency.selectedIndex, userInputCurrency.selectedIndex];
}

const setHistory = (input, output) => {
    let table = document.getElementById("history-table");
    let historyList = JSON.parse(localStorage.getItem("historyList")) || [];
    const newEntry = {input, output};

    if (!historyList.some(entry => JSON.stringify(entry) === JSON.stringify(newEntry))) {
        if (historyList.length === 10) {
            historyList.pop();
        }
        historyList.unshift(newEntry);
    }

    table.innerHTML = '';
    historyList.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.input} → ${item.output}`;
        table.appendChild(li);
    });

    localStorage.setItem("historyList", JSON.stringify(historyList));
}

window.addEventListener('DOMContentLoaded', () => {
    drawHeaderDate();

    let userInput = document.getElementById("user-input");
    let userOutput = document.getElementById("user-output");
    let userInputCurrency = document.getElementById("user-input-currency");
    let userOutputCurrency = document.getElementById("user-output-currency");

    userInput.addEventListener("change", (event) => {
        if (isValid(event.target.value)) {
            calculateRate(event.target.value, userInputCurrency, userOutputCurrency, userInput, userOutput);
            drawHeaderDate();
            setHistory(`${userInput.value} - ${userInputCurrency.options[userInputCurrency.selectedIndex].value}`, `${userOutput.value} - ${userOutputCurrency.options[userOutputCurrency.selectedIndex].value}`);
        } else {
            alert("Wrong input");
        }
    });
});