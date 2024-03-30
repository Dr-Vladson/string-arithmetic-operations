class BigInteger {
    static charToNumDictionary = {
        ["0"]: 0,
        ["1"]: 1,
        ["2"]: 2,
        ["3"]: 3,
        ["4"]: 4,
        ["5"]: 5,
        ["6"]: 6,
        ["7"]: 7,
        ["8"]: 8,
        ["9"]: 9,
    };

    #value;

    get value() {
        return this.#value;
    }

    static getIsStrBigInt(str) {
        if (typeof str !== "string" || str.length === 0) return false;

        for (let char of str) {
            if (this.charToNumDictionary[char] === undefined) return false;
        }
        return true;
    }

    getStrWithoutExtraZeros(str) {
        if (typeof str !== "string") return null;
        const firstNonZeroIndex = str
            .split("")
            .findIndex((char) => char !== "0");
        if (firstNonZeroIndex === -1) return "0";
        return str.slice(firstNonZeroIndex);
    }

    constructor(str) {
        const strWithoutExtraZeros = this.getStrWithoutExtraZeros(str);
        if (!this.constructor.getIsStrBigInt(strWithoutExtraZeros))
            throw new SyntaxError("Invalid string was provided as big integer");
        this.#value = strWithoutExtraZeros;
    }

    #getTwoDigitNumPartsArray(num) {
        if (typeof num !== "number" || isNaN(num)) return null;

        const strOfNum = Math.abs(num).toString();
        const num1 = strOfNum[strOfNum.length - 1];
        const num2 = strOfNum[strOfNum.length - 2];
        return [
            num1 ? this.constructor.charToNumDictionary[num1] : 0,
            num2 ? this.constructor.charToNumDictionary[num2] : 0,
        ];
    }

    plus(bigInt) {
        if (!(bigInt instanceof BigInteger))
            throw new SyntaxError("Argument should be of BigInteger type");

        let biggestInt = this.#value;
        let smallestInt = bigInt.#value;
        if (biggestInt.length < smallestInt.length) {
            biggestInt = bigInt.#value;
            smallestInt = this.value;
        }

        const lengthDif = biggestInt.length - smallestInt.length;
        let excess = 0;
        const result = [];
        for (let i = biggestInt.length - 1; i >= -1; i--) {
            const smallestIntChar = smallestInt[i - lengthDif] || "0";
            const biggestIntChar = biggestInt[i] || "0";

            const sum =
                this.constructor.charToNumDictionary[biggestIntChar] +
                this.constructor.charToNumDictionary[smallestIntChar] +
                excess;
            const sumParts = this.#getTwoDigitNumPartsArray(sum);
            result.unshift(sumParts[0]);
            excess = sumParts[1];
        }
        if (result[0] === 0) result.shift();

        return new BigInteger(result.join(""));
    }

    minus(bigInt) {
        if (!(bigInt instanceof BigInteger))
            throw new SyntaxError("Argument should be of BigInteger type");

        let biggestInt = this.#value;
        let smallestInt = bigInt.#value;
        if (biggestInt.length < smallestInt.length)
            throw new SyntaxError(
                "Argument mustn`t be greater than first big integer"
            );

        const lengthDif = biggestInt.length - smallestInt.length;
        let excess = 0;
        const result = [];
        for (let i = biggestInt.length - 1; i >= -1; i--) {
            if (i === lengthDif - 1 && !biggestInt[i] && excess !== 0) {
                throw new SyntaxError(
                    "Argument mustn`t be greater than first big integer"
                );
            }

            const smallestIntChar = smallestInt[i - lengthDif] || "0";
            const biggestIntChar = biggestInt[i] || "0";

            let difference =
                this.constructor.charToNumDictionary[biggestIntChar] -
                this.constructor.charToNumDictionary[smallestIntChar] -
                excess;
            if (difference < 0) {
                difference += 10;
                excess = 1;
            } else excess = 0;

            const sumParts = this.#getTwoDigitNumPartsArray(difference);
            result.unshift(sumParts[0]);
        }

        return new BigInteger(this.getStrWithoutExtraZeros(result.join("")));
    }
}

// some tests and comparison with BigInt
console.log(
    new BigInteger(
        "0000000099999999999999999999999999999999999999999999999"
    ).plus(new BigInteger("99897335535781229256266")).value
);
console.log(
    BigInt("0000000099999999999999999999999999999999999999999999999") +
        BigInt("99897335535781229256266")
);
console.log("_____________________________________________________");
console.log(
    new BigInteger("0000009999999966669991434127576956324365878970").minus(
        new BigInteger("99897335535781229256266")
    ).value
);
console.log(
    BigInt("0000009999999966669991434127576956324365878970") -
        BigInt("99897335535781229256266")
);
console.log("_____________________________________________________");
console.log(
    new BigInteger("0000009999999966669991434127576956324365878970").multiply(
        new BigInteger("99897335535781229256266")
    ).value
);
console.log(
    BigInt("0000009999999966669991434127576956324365878970") *
        BigInt("99897335535781229256266")
);
console.log("_____________________________________________________");
