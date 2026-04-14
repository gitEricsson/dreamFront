class CalculatorUI {
  constructor() {
    this.calculator = new Calculator();
    this.displayElement = document.getElementById('display');
    this.currentInput = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;

    this.initEventListeners();
    this.updateDisplay();
  }

  initEventListeners() {
    document.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', () => {
        this.handleNumber(button.dataset.number);
      });
    });

    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', () => {
        this.handleAction(button.dataset.action);
      });
    });

    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleNumber(num) {
    if (this.shouldResetDisplay) {
      this.currentInput = num;
      this.shouldResetDisplay = false;
    } else {
      if (this.currentInput === '0' && num !== '.') {
        this.currentInput = num;
      } else {
        this.currentInput += num;
      }
    }
    this.updateDisplay();
  }

  handleAction(action) {
    const currentValue = parseFloat(this.currentInput);

    switch (action) {
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        this.handleOperation(action, currentValue);
        break;

      case 'equals':
        this.handleEquals(currentValue);
        break;

      case 'clear':
        this.handleClear();
        break;

      case 'decimal':
        this.handleDecimal();
        break;

      case 'negate':
        this.handleNegate();
        break;

      case 'backspace':
        this.handleBackspace();
        break;

    }
  }

  handleOperation(op, value) {
    if (this.previousValue !== null && this.operation && !this.shouldResetDisplay) {
      this.handleEquals(value);
    } else {
      this.previousValue = value;
    }
    this.operation = op;
    this.shouldResetDisplay = true;
  }

  handleEquals(currentValue) {
    if (this.previousValue === null || !this.operation) {
      return;
    }

    let result;
    try {
      switch (this.operation) {
        case 'add':
          result = this.calculator.add(this.previousValue, currentValue);
          break;
        case 'subtract':
          result = this.calculator.subtract(this.previousValue, currentValue);
          break;
        case 'multiply':
          result = this.calculator.multiply(this.previousValue, currentValue);
          break;
        case 'divide':
          result = this.calculator.divide(this.previousValue, currentValue);
          break;
      }

      result = Math.round(result * 1000000000) / 1000000000;
      
      this.currentInput = result.toString();
      this.previousValue = null;
      this.operation = null;
      this.shouldResetDisplay = true;
      this.updateDisplay();
    } catch (error) {
      this.displayError(error.message);
    }
  }

  handleClear() {
    this.currentInput = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetDisplay = false;
    this.calculator.clear();
    this.updateDisplay();
  }

  handleDecimal() {
    if (this.shouldResetDisplay) {
      this.currentInput = '0.';
      this.shouldResetDisplay = false;
    } else if (!this.currentInput.includes('.')) {
      this.currentInput += '.';
    }
    this.updateDisplay();
  }

  handleNegate() {
    if (this.currentInput !== '0') {
      if (this.currentInput.startsWith('-')) {
        this.currentInput = this.currentInput.substring(1);
      } else {
        this.currentInput = '-' + this.currentInput;
      }
      this.updateDisplay();
    }
  }

  handleBackspace() {
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    this.updateDisplay();
  }


  handleKeyboard(e) {
    if (e.key >= '0' && e.key <= '9') {
      this.handleNumber(e.key);
    } else if (e.key === '.') {
      this.handleAction('decimal');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.handleAction('equals');
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      this.handleAction('backspace');
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
      this.handleAction('clear');
    } else if (e.key === '+') {
      this.handleAction('add');
    } else if (e.key === '-') {
      this.handleAction('subtract');
    } else if (e.key === '*') {
      this.handleAction('multiply');
    } else if (e.key === '/') {
      e.preventDefault();
      this.handleAction('divide');
    }
  }

  updateDisplay() {
    const value = parseFloat(this.currentInput);
    const displayValue = this.currentInput.length > 12 
      ? value.toExponential(6) 
      : this.currentInput;
    
    this.displayElement.textContent = displayValue;
  }


  displayError(message) {
    this.displayElement.textContent = 'Error';
    setTimeout(() => {
      this.currentInput = '0';
      this.updateDisplay();
    }, 1500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CalculatorUI();
});