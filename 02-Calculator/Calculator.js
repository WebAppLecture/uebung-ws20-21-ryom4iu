import { MyMath } from "../01-MyMath/MyMath.js";

export class Calculator {
  constructor(numpad, outputCalculation, outputSolution) {
    this.numpad = numpad;
    this.outputCalculation = outputCalculation;
    this.outputSolution = outputSolution;
    this.lhs = "";
    this.rhs = "";
    this.op = "";
    this.result = new MyMath();
    this.setupNumPad();
  }

  setupNumPad() {
    let symbols = [
      "7","8","9","+",
      "4","5","6","-",
      "1","2","3","*",
      "0","!","^","/",
      "AC"
    ];
    for (let symbol of symbols) {
      let button = document.createElement("button");
      button.innerText = symbol;
      button.addEventListener("click", this.onButtonClick.bind(this, symbol));
      this.numpad.appendChild(button);
    }
    this.printSolution(0);
  }

  onButtonClick(symbol) {
    switch (symbol) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^":
      case "!":
        this.op = symbol;
        this.lhs = this.result.value;
        this.rhs = "";
        break;
      case "AC":
        this.clear();
        this.lhs = this.rhs = this.op = "";
        break;
      default:
        if (this.op !== "!")
          this.rhs += symbol;
    }
    this.result = new MyMath(this.lhs);
    if (this.rhs || this.op === "!") {
      switch (this.op) {
        case "":
        case "+":
          this.result.add(this.rhs);
          break;
        case "-":
          this.result.subtract(this.rhs);
          break;
        case "*":
          this.result.multiply(this.rhs);
          break;
        case "/":
          this.result.divide(this.rhs);
          break;
        case "^":
          this.result.pow(this.rhs);
          break;
        case "!":
          this.result.factorial();
          break;
      }
    }
    this.printSolution(this.result.value);
    this.print(this.lhs + this.op + this.rhs);
  }

  print(string) {
    this.outputCalculation.innerText = string;
  }

  printSolution(string) {
    this.outputSolution.innerText = string;
  }

  clear() {
    this.outputSolution.innerText = "";
    this.outputCalculation.innerText = "";
  }
}
