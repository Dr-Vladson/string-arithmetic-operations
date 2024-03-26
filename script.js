class StringWithArithmetics extends String {
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

    static convertStrToInt(str) {
        if (typeof str !== "string") return;

        let result = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const num = this.charToNumDictionary[char];
            if (num === undefined) return;

            result += num * Math.pow(10, str.length - 1 - i);
        }
        return result;
    }

    constructor(value) {
        super(value);
        this.intOfStr = this.constructor.convertStrToInt(this.valueOf());
    }

    plus(str) {
        const intOfArg = this.constructor.convertStrToInt(str);
        if (!this.intOfStr || !intOfArg) return;

        return new StringWithArithmetics(this.intOfStr + intOfArg);
    }

    minus(str) {
        const intOfArg = this.constructor.convertStrToInt(str);
        if (!this.intOfStr || !intOfArg || this.intOfStr < intOfArg) return;

        return new StringWithArithmetics(this.intOfStr - intOfArg);
    }

    divide(str) {
        const intOfArg = this.constructor.convertStrToInt(str);
        if (!this.intOfStr || !intOfArg) return;

        return new StringWithArithmetics(Math.floor(this.intOfStr / intOfArg));
    }

    multiply(str) {
        const intOfArg = this.constructor.convertStrToInt(str);
        if (!this.intOfStr || !intOfArg) return;

        return new StringWithArithmetics(this.intOfStr * intOfArg);
    }
}

// some tests
console.log(new StringWithArithmetics("900").plus("90")); // 990
console.log(new StringWithArithmetics("90").plus("9000")); // 9090

console.log(new StringWithArithmetics("90").minus("9000")); // undefined
console.log(new StringWithArithmetics("900").minus("90")); // 810

console.log(new StringWithArithmetics("910").divide("90")); // 10
console.log(new StringWithArithmetics("90").divide("900")); // 0

console.log(new StringWithArithmetics("90").multiply("900")); // 81000

console.log(new StringWithArithmetics("00090").multiply("000900")); // 81000

console.log(new StringWithArithmetics("9g0").multiply("3")); // undefined
console.log(new StringWithArithmetics("90").multiply("3jk")); // undefined
console.log(new StringWithArithmetics(90).multiply("3")); // 270
console.log(new StringWithArithmetics().multiply("3")); // undefined
console.log(new StringWithArithmetics("89").multiply()); // undefined
console.log(new StringWithArithmetics("5").multiply("5").minus("5")); // 20
