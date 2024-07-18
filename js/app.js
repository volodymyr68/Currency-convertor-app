const NBU_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

const getCurrencyRate = async (NBU_URL) => {
    const response = await fetch(NBU_URL);
    return response.json();
}

const getHeaderList = () => {
    return JSON.parse(localStorage.getItem("headerList"));
}

const getLastUpdate = () => {
    return localStorage.getItem("lastUpdate");
}

const getAllRates = () => {
    return JSON.parse(localStorage.getItem("allRates"));
}

const updateLastUpdateElement = (lastLocalUpdate) => {
    let lastUpdateElement = document.getElementById("latest-update");
    lastUpdateElement.textContent = lastLocalUpdate ? `Last update: ${lastLocalUpdate}` : `Last update: never`
}

const setCurrencyName = (allRates) => {
    let selects = document.getElementsByClassName("bid-currency");
    Array.from(selects).forEach(select => {
        allRates.forEach(rate => {
            let option = document.createElement("option");
            option.textContent = rate.txt;
            select.appendChild(option);
        });
    });

}

const isValid = (value) => {
    return !isNaN(value) && value.trim() !== "";
}

const setLocalRates = async () => {
    const rates = await getCurrencyRate(NBU_URL);
    const currentDate = new Date().toLocaleString();
    localStorage.setItem("allRates", JSON.stringify(rates));
    localStorage.setItem("lastUpdate", currentDate)
    updateLastUpdateElement(currentDate);
    setCurrencyName(getAllRates())
}

const drawWidgets = async (widgets, headerList) => {
    if (headerList && headerList.length > 0) {
        console.log(headerList[0].txt)
        Array.from(widgets).forEach((elem, index) => {
            elem.textContent = `${headerList[index].txt} - ${headerList[index].rate.toFixed(2)}` || '';
        });
    } else {
        try {
            const response = await getCurrencyRate(NBU_URL);
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
        updateLastUpdateElement(getLastUpdate());
        setCurrencyName(getAllRates());
    }

    drawWidgets(widgets, headerList);
    drawHistory(getLocalHistory());

};

const calculateRate = (rate, userInputCurrency, userOutputCurrency, userInput, userOutput) => {
    const allRates = getAllRates();
    const inputResult = allRates.filter(item => item.txt === userInputCurrency.options[userInputCurrency.selectedIndex].value)[0];
    const outputResult = allRates.filter(item => item.txt === userOutputCurrency.options[userOutputCurrency.selectedIndex].value)[0];
    const CORRELATION = (inputResult.rate / outputResult.rate).toFixed(3);
    userOutput.value = (CORRELATION * rate).toFixed(3);
    let headerList = getHeaderList() || [];
    headerList.slice(2);
    console.log(inputResult, outputResult)
    headerList.unshift(inputResult, outputResult);
    localStorage.setItem("headerList", JSON.stringify(headerList));
}

const swapInputs = () => {
    let userInput = document.getElementById("user-input");
    let userOutput = document.getElementById("user-output");
    let userInputCurrency = document.getElementById("user-input-currency");
    let userOutputCurrency = document.getElementById("user-output-currency");

    let tempValue = userInput.value;
    userInput.value = userOutput.value;
    userOutput.value = tempValue;

    let tempCurrency = userInputCurrency.selectedIndex;
    userInputCurrency.selectedIndex = userOutputCurrency.selectedIndex;
    userOutputCurrency.selectedIndex = tempCurrency;
}

const getLocalHistory = () => {
    return JSON.parse(localStorage.getItem("historyList"));
}

const setLocalHistory = (input, output) => {
    let historyList = JSON.parse(localStorage.getItem("historyList")) || [];
    if (historyList && historyList.length === 10) {
        historyList.pop();
        historyList.unshift({input, output});
    } else {
        historyList.unshift({input, output});
    }
    localStorage.setItem("historyList", JSON.stringify(historyList));
}

const drawHistory = (historyList) => {
    let table = document.getElementById("history-table");
    table.innerHTML = '';

    historyList.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.input} → ${item.output}`;
        table.appendChild(li);
    });
};


window.addEventListener('DOMContentLoaded', () => {
    drawHeaderDate();
    let userInput = document.getElementById("user-input");
    let userOutput = document.getElementById("user-output");
    let userInputCurrency = document.getElementById("user-input-currency");
    let userOutputCurrency = document.getElementById("user-output-currency");
    const headerList = getHeaderList();
    userInput.addEventListener("change", (event) => {
        if (isValid(event.target.value)) {
            calculateRate(event.target.value, userInputCurrency, userOutputCurrency, userInput, userOutput);
            drawHeaderDate();
            let input = `${userInput.value} - ${userInputCurrency.options[userInputCurrency.selectedIndex].value}`;
            let output = `${userOutput.value} - ${userOutputCurrency.options[userOutputCurrency.selectedIndex].value}`;
            setLocalHistory(input, output);
            drawHistory(getLocalHistory());
        } else {
            alert("Wrong input");
        }
    });
});




