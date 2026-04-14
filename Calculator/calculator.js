class Calculator {
  constructor() {
    this.currentValue = 0;
  }

  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    return a / b;
  }

  clear() {
    this.currentValue = 0;
  }

  reset() {
    this.currentValue = 0;
  }

  getCurrentValue() {
    return this.currentValue;
  }

  setCurrentValue(value) {
    this.currentValue = value;
  }

}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}
if (typeof window !== 'undefined') {
  window.Calculator = Calculator;
}