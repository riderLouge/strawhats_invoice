function numberToWords(num) {
    if (num === 0) return "zero rupees only";

    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const thousands = ["", "thousand", "million", "billion"];

    let result = "";

    function convertChunk(number) {
        let chunkResult = "";

        if (number >= 100) {
            chunkResult += ones[Math.floor(number / 100)] + " hundred ";
            number %= 100;
        }

        if (number >= 11 && number < 20) {
            chunkResult += teens[number - 10] + " ";
        } else {
            chunkResult += tens[Math.floor(number / 10)] + " ";
            number %= 10;
            chunkResult += ones[number] + " ";
        }

        return chunkResult.trim();
    }

    let chunkCount = 0;

    while (num > 0) {
        let chunk = num % 1000;
        if (chunk !== 0) {
            let chunkText = convertChunk(chunk);
            result = chunkText + (thousands[chunkCount] ? " " + thousands[chunkCount] + " " : "") + result;
        }
        num = Math.floor(num / 1000);
        chunkCount++;
    }

    return result.trim() + " rupees only";
}
export default numberToWords;
