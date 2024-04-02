String.getIsStrInt = function (str) {
    if (typeof str !== "string" || str.length === 0) return false;

    for (let char of str) {
        if (isNaN(Number(char))) return false;
    }
    return true;
};

String.getStrWithoutExtraZeros = function (str) {
    if (typeof str !== "string") return null;
    const firstNonZeroIndex = str.split("").findIndex((char) => char !== "0");
    if (firstNonZeroIndex === -1) return "0";
    return str.slice(firstNonZeroIndex);
};

String.getStrForArithmeticIfPossible = function (str) {
    str = String.getStrWithoutExtraZeros(str);
    if (String.getIsStrInt(str)) return str;
    else return null;
};

String.prototype._getTwoDigitNumPartsArray = function (num) {
    if (typeof num !== "number" || isNaN(num)) return null;

    const strOfNum = Math.abs(num).toString();
    const num1 = strOfNum[strOfNum.length - 1];
    const num2 = strOfNum[strOfNum.length - 2];
    return [num1 ? Number(num1) : 0, num2 ? Number(num2) : 0];
};

String.prototype.arithmeticCompare = function (str) {
    const int1 = String.getStrForArithmeticIfPossible(this.valueOf());
    const int2 = String.getStrForArithmeticIfPossible(str);

    if (!int1 || !int2)
        throw new SyntaxError("This string and argument should be arithmetic");

    if (int1.length > int2.length) return 1;
    if (int1.length < int2.length) return -1;

    for (let i = 0; i < int1.length; i++) {
        const charInt1 = Number(int1[i]);
        const charInt2 = Number(int2[i]);
        if (charInt1 > charInt2) return 1;
        if (charInt1 < charInt2) return -1;
    }
    return 0;
};

String.prototype.plus = function (str) {
    let biggestInt = String.getStrForArithmeticIfPossible(this.valueOf());
    let smallestInt = String.getStrForArithmeticIfPossible(str);

    if (!biggestInt || !smallestInt)
        throw new SyntaxError("This string and argument should be arithmetic");

    if (biggestInt.length < smallestInt.length) {
        const savedInt = biggestInt;
        biggestInt = smallestInt;
        smallestInt = savedInt;
    }

    const lengthDif = biggestInt.length - smallestInt.length;
    let excess = 0;
    const result = [];
    for (let i = biggestInt.length - 1; i >= -1; i--) {
        const smallestIntChar = smallestInt[i - lengthDif] || "0";
        const biggestIntChar = biggestInt[i] || "0";

        const sum = Number(biggestIntChar) + Number(smallestIntChar) + excess;
        const sumParts = this._getTwoDigitNumPartsArray(sum);
        result.unshift(sumParts[0]);
        excess = sumParts[1];
    }
    if (result[0] === 0) result.shift();

    return result.join("");
};

String.prototype.minus = function (str) {
    const biggestInt = String.getStrForArithmeticIfPossible(this.valueOf());
    const smallestInt = String.getStrForArithmeticIfPossible(str);

    if (!biggestInt || !smallestInt)
        throw new SyntaxError("This string and argument should be arithmetic");

    const compareRusult = biggestInt.arithmeticCompare(smallestInt);
    if (compareRusult === -1) return null;
    if (compareRusult === 0) return "0";

    const lengthDif = biggestInt.length - smallestInt.length;
    let excess = 0;
    const result = [];
    for (let i = biggestInt.length - 1; i >= -1; i--) {
        const smallestIntChar = smallestInt[i - lengthDif] || "0";
        const biggestIntChar = biggestInt[i] || "0";

        let difference =
            Number(biggestIntChar) - Number(smallestIntChar) - excess;
        if (difference < 0) {
            difference += 10;
            excess = 1;
        } else excess = 0;

        const sumParts = this._getTwoDigitNumPartsArray(difference);
        result.unshift(sumParts[0]);
    }

    return this.constructor.getStrWithoutExtraZeros(result.join(""));
};

String.prototype.multiply = function (str) {
    let biggestInt = String.getStrForArithmeticIfPossible(this.valueOf());
    let smallestInt = String.getStrForArithmeticIfPossible(str);

    if (!biggestInt || !smallestInt)
        throw new SyntaxError("This string and argument should be arithmetic");

    if (biggestInt.length < smallestInt.length) {
        const savedInt = biggestInt;
        biggestInt = smallestInt;
        smallestInt = savedInt;
    }

    let excess = 0;
    let result = "0";
    for (let i = 0; i < smallestInt.length; i++) {
        const smallestIntChar = smallestInt[i];
        if (smallestIntChar === "0") continue;

        const iterationResult = [];
        for (let j = biggestInt.length - 1; j >= -1; j--) {
            const biggestIntChar = biggestInt[j] || "0";

            const product =
                Number(biggestIntChar) * Number(smallestIntChar) + excess;
            const productParts = this._getTwoDigitNumPartsArray(product);
            iterationResult.unshift(productParts[0]);
            excess = productParts[1];
        }

        for (let j = 1; j < smallestInt.length - i; j++) {
            iterationResult.push(0);
        }

        result = result.plus(iterationResult.join(""));
    }

    return result;
};

String.prototype.divide = function (str) {
    let devident = String.getStrForArithmeticIfPossible(this.valueOf());
    let devisor = String.getStrForArithmeticIfPossible(str);
    if (!devident || !devisor)
        throw new SyntaxError("This string and argument should be arithmetic");
    if (devisor === "0") throw new RangeError("Devision by 0");

    if (devisor === "1") return devident;
    const compareRusult = devident.arithmeticCompare(devisor);
    if (compareRusult === -1) return "0";
    if (compareRusult === 0) return "1";

    const devisorLength = devisor.length;
    let subDevident = devident.slice(0, devisorLength - 1);
    let remainder = devident.slice(devisorLength - 1);
    let result = "";
    while (remainder) {
        subDevident = subDevident + remainder[0];
        remainder = remainder.slice(1);

        let subResult = 0;
        while (true) {
            const subtractionResult = subDevident.minus(devisor);
            if (!subtractionResult) break;

            subDevident = subtractionResult;
            subResult++;
        }
        result += subResult;
    }

    if (result.startsWith("0")) result = result.slice(1);
    if (result === "") result = "0";
    return result;
};

//tests and comparison with BigInt
console.log(
    "0000000099999999999000999999999999900099999999999999999999999".plus(
        "99897335535700081229256266"
    )
);
console.log(
    BigInt("0000000099999999999000999999999999900099999999999999999999999") +
        BigInt("99897335535700081229256266")
);
console.log("_____________________________________________________");
console.log(
    "0000009999999966669991434127576956324365878970".minus(
        "99897335535781229256266"
    )
);
console.log(
    BigInt("0000009999999966669991434127576956324365878970") -
        BigInt("99897335535781229256266")
);
console.log("_____________________________________________________");
console.log(
    "00000099999999066606999143041275760956324365878970".multiply(
        "998970335530050781229020562066"
    )
);
console.log(
    BigInt("00000099999999066606999143041275760956324365878970") *
        BigInt("998970335530050781229020562066")
);
console.log("_____________________________________________________");
console.log(
    "0000009999999966669991434127576956324365878970".divide(
        "99897335535781229256266"
    )
);
console.log(
    BigInt("0000009999999966669991434127576956324365878970") /
        BigInt("99897335535781229256266")
);
