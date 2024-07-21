const capitalizeText = (text) => {
    return text.toLowerCase().charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
export default capitalizeText;
