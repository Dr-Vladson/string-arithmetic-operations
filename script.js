class BigInteger {
    #value;

    get value() {
        return this.#value;
    }

    static getIsStrBigInt(str) {
        if (typeof str !== "string" || str.length === 0) return false;

        for (let char of str) {
            if (isNaN(Number(char))) return false;
        }
        return true;
    }

    static getStrWithoutExtraZeros(str) {
        if (typeof str !== "string") return null;
        const firstNonZeroIndex = str
            .split("")
            .findIndex((char) => char !== "0");
        if (firstNonZeroIndex === -1) return "0";
        return str.slice(firstNonZeroIndex);
    }

    constructor(str) {
        const strWithoutExtraZeros =
            this.constructor.getStrWithoutExtraZeros(str);
        if (!this.constructor.getIsStrBigInt(strWithoutExtraZeros))
            throw new SyntaxError("Invalid string was provided as big integer");
        this.#value = strWithoutExtraZeros;
    }

    #getTwoDigitNumPartsArray(num) {
        if (typeof num !== "number" || isNaN(num)) return null;

        const strOfNum = Math.abs(num).toString();
        const num1 = strOfNum[strOfNum.length - 1];
        const num2 = strOfNum[strOfNum.length - 2];
        return [num1 ? Number(num1) : 0, num2 ? Number(num2) : 0];
    }

    compare(bigInt) {
        if (!(bigInt instanceof BigInteger))
            throw new SyntaxError("Argument should be of BigInteger type");

        const bigIntValue1 = this.#value;
        const bigIntValue2 = bigInt.#value;

        if (bigIntValue1.length > bigIntValue2.length) return 1;
        if (bigIntValue1.length < bigIntValue2.length) return -1;

        for (let i = 0; i < bigIntValue1.length; i++) {
            const charInt1 = Number(bigIntValue1[i]);
            const charInt2 = Number(bigIntValue2[i]);
            if (charInt1 > charInt2) return 1;
            if (charInt1 < charInt2) return -1;
        }
        return 0;
    }

    plus(bigInt) {
        if (!(bigInt instanceof BigInteger))
            throw new SyntaxError("Argument should be of BigInteger type");

        let biggestInt = this.#value;
        let smallestInt = bigInt.#value;
        if (biggestInt.length < smallestInt.length) {
            biggestInt = bigInt.#value;
            smallestInt = this.#value;
        }

        const lengthDif = biggestInt.length - smallestInt.length;
        let excess = 0;
        const result = [];
        for (let i = biggestInt.length - 1; i >= -1; i--) {
            const smallestIntChar = smallestInt[i - lengthDif] || "0";
            const biggestIntChar = biggestInt[i] || "0";

            const sum =
                Number(biggestIntChar) + Number(smallestIntChar) + excess;
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

        const compareRusult = this.compare(bigInt);
        if (compareRusult === -1) return null;
        if (compareRusult === 0) return new BigInteger("0");

        const biggestInt = this.#value;
        const smallestInt = bigInt.#value;
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

            const sumParts = this.#getTwoDigitNumPartsArray(difference);
            result.unshift(sumParts[0]);
        }

        return new BigInteger(
            this.constructor.getStrWithoutExtraZeros(result.join(""))
        );
    }

    multiply(bigInt) {
        if (!(bigInt instanceof BigInteger))
            throw new SyntaxError("Argument should be of BigInteger type");

        let biggestInt = this.#value;
        let smallestInt = bigInt.#value;
        if (biggestInt.length < smallestInt.length) {
            biggestInt = bigInt.#value;
            smallestInt = this.value;
        }

        let excess = 0;
        let result = new BigInteger("0");
        for (let i = 0; i < smallestInt.length; i++) {
            const smallestIntChar = smallestInt[i];
            if (smallestIntChar === "0") continue;

            const iterationResult = [];
            for (let j = biggestInt.length - 1; j >= -1; j--) {
                const biggestIntChar = biggestInt[j] || "0";

                const product =
                    Number(biggestIntChar) * Number(smallestIntChar) + excess;
                const productParts = this.#getTwoDigitNumPartsArray(product);
                iterationResult.unshift(productParts[0]);
                excess = productParts[1];
            }

            for (let j = 1; j < smallestInt.length - i; j++) {
                iterationResult.push(0);
            }

            result = result.plus(new BigInteger(iterationResult.join("")));
        }

        return result;
    }

    divide(devisor) {
        if (!(devisor instanceof BigInteger))
            throw new SyntaxError("Argument should be of BigInteger type");
        if (devisor.#value === "0") throw new RangeError("Devision by 0");

        if (devisor.#value === "1") return new BigInteger(this.#value);
        const compareRusult = this.compare(devisor);
        if (compareRusult === -1) return new BigInteger("0");
        if (compareRusult === 0) return new BigInteger("1");

        const devisorLength = devisor.#value.length;
        let subDevident = this.#value.slice(0, devisorLength - 1);
        let remainder = this.#value.slice(devisorLength - 1);
        let result = "";
        while (remainder) {
            subDevident = subDevident + remainder[0];
            remainder = remainder.slice(1);

            let subResult = 0;
            subDevident = new BigInteger(subDevident);
            while (true) {
                const subtractionResult = subDevident.minus(devisor);
                if (!subtractionResult) break;

                subDevident = subtractionResult;
                subResult++;
            }
            subDevident = subDevident.value;
            result += subResult;
        }

        if (result === "") result = "0";
        return new BigInteger(result);
    }
}

// example of tests with comparison with BigInt
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
console.log(
    new BigInteger("0000009999999966669991434127576956324365878970").divide(
        new BigInteger("99897335535781229256266")
    ).value
);
console.log(
    BigInt("0000009999999966669991434127576956324365878970") /
        BigInt("99897335535781229256266")
);
