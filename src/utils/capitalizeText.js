const capitalizeText = (text) => {
    const formattedWord = text.split('_').join(" ");
    return formattedWord.toLowerCase().charAt(0).toUpperCase() + formattedWord.slice(1).toLowerCase();
};
export default capitalizeText;
