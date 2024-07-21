
const currencyFormatter = (amount, currency) => {
    console.log(amount)
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2
    });

    return <span>{formatter.format(amount)}</span>;
};

export default currencyFormatter;