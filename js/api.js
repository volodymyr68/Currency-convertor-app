export const NBU_URL =
    "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

// API Functions
export const makeRequest = async (URL) => {
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching currency rates:", error);
        throw error;
    }
};
