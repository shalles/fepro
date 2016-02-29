import * as math from "../data/data.json";

export class Calc {
    constructor() {
        console.log('Calc constructor');
    }
    add(a, b) {
        return a + b;
    }
}

console.log("math", math)

// usage
// var c = new Calc();
// console.log(c.add(1, 2));