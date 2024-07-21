// Validation Function
export const isValid = (value) => {
    return !isNaN(value) && value.trim() !== "";
};
