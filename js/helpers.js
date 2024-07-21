//Helpers
export const getUniqueList = (headerList, inputResult, outputResult) => {
    let resultList = [];
    if (JSON.stringify(inputResult) === JSON.stringify(outputResult)) {
        resultList.push(inputResult);
    } else {
        resultList.push(inputResult, outputResult);
    }
    for (let item of headerList) {
        if (
            JSON.stringify(item) !== JSON.stringify(inputResult) &&
            JSON.stringify(item) !== JSON.stringify(outputResult)
        ) {
            resultList.push(item);
        }
        if (resultList.length === 4) {
            break;
        }
    }
    return resultList;
};

export const updateHistoryList = (historyList, input, output) => {
    if (historyList && historyList.length === 10) {
        historyList.pop();
        historyList.unshift({ input, output });
    } else {
        historyList.unshift({ input, output });
    }
    return historyList;
};

export const getInputs = () => {
    return [
        document.getElementById("user-input"),
        document.getElementById("user-output"),
    ];
};

export const getSelectedOptions = () => {
    return [
        document.getElementById("user-input-currency"),
        document.getElementById("user-output-currency"),
    ];
};
