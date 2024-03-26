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
        console.log(this.intOfStr);
        console.log(intOfArg);
        if (!this.intOfStr || !intOfArg) return;

        return (this.intOfStr + intOfArg).toString();
    }
    minus(str) {}
    divide(str) {}
    multiply(str) {}
}

console.log(StringWithArithmetics.convertStrToInt(454));
console.log(StringWithArithmetics.convertStrToInt("00000565"));
console.log(StringWithArithmetics.convertStrToInt("65650"));
console.log(StringWithArithmetics.convertStrToInt("65600075258"));
console.log(String);
console.log(String.prototype);
console.log(new StringWithArithmetics("121").plus("90567"));
