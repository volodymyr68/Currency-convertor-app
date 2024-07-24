import {
    calculateRate,
    drawHeaderDate,
    drawHistory,
    drawLastCurrency,
    swapInputs,
} from "./dom.js";
import {
    getLocalHistory,
    refreshRatesAndDOM,
    setLocalHistory,
} from "./storage.js";
import { isValid } from "./validation.js";
import { setCookies } from "./cookie.js";
import { getInputs, getSelectedOptions } from "./helpers.js";

export const app = async () => {
    window.addEventListener("DOMContentLoaded", () => {
        drawHeaderDate();
        drawHistory(getLocalHistory());
        userInputCurrencyListener();
        userInputListener();
        drawLastCurrency();
        updateButtonListener();
        swapButtonListener();
    });
};

const swapButtonListener = () => {
    let swapBtn = document.getElementById("btn-swap");
    swapBtn.addEventListener("click", () => {
        swapInputs();
    });
};

const updateButtonListener = () => {
    let updateBtn = document.getElementById("btn-update");
    updateBtn.addEventListener("click", async () => {
        try{
            await refreshRatesAndDOM();
        }
        catch (error){
            console.error("Error refreshRatesAndDOM:", error);
        }
    });
};

const userInputListener = () => {
    let [userInput, userOutput] = getInputs();
    let [userInputCurrency, userOutputCurrency] = getSelectedOptions();

    userInput.addEventListener("change", (event) => {
        if (isValid(event.target.value)) {
            calculateRate(
                userInputCurrency,
                userOutputCurrency,
                userInput,
                userOutput,
            );
            drawHeaderDate();
            let input = `${userInput.value} - ${userInputCurrency.options[userInputCurrency.selectedIndex].value}`;
            let output = `${userOutput.value} - ${userOutputCurrency.options[userOutputCurrency.selectedIndex].value}`;
            setLocalHistory(input, output);
            drawHistory(getLocalHistory());
        } else {
            alert("Wrong input");
        }
    });
};

const userInputCurrencyListener = () => {
    let [userInputCurrency, userOutputCurrency] = getSelectedOptions();
    userInputCurrency.addEventListener("change", () => {
        setCookies(
            userInputCurrency.selectedIndex,
            userOutputCurrency.selectedIndex,
        );
    });
    userOutputCurrency.addEventListener("change", () => {
        setCookies(
            userInputCurrency.selectedIndex,
            userOutputCurrency.selectedIndex,
        );
    });
};
