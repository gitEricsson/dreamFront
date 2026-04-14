const Calculator = require('./calculator');

describe('Calculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe('Addition', () => {
    test('should add two positive numbers', () => {
      expect(calculator.add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(calculator.add(-5, -3)).toBe(-8);
    });

    test('should add positive and negative numbers', () => {
      expect(calculator.add(10, -4)).toBe(6);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe('Subtraction', () => {
    test('should subtract two positive numbers', () => {
      expect(calculator.subtract(10, 3)).toBe(7);
    });

    test('should subtract negative numbers', () => {
      expect(calculator.subtract(-5, -3)).toBe(-2);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.subtract(5.5, 2.3)).toBeCloseTo(3.2);
    });
  });

  describe('Multiplication', () => {
    test('should multiply two positive numbers', () => {
      expect(calculator.multiply(4, 5)).toBe(20);
    });

    test('should multiply by zero', () => {
      expect(calculator.multiply(5, 0)).toBe(0);
    });

    test('should multiply negative numbers', () => {
      expect(calculator.multiply(-3, -4)).toBe(12);
    });

    test('should handle decimal numbers', () => {
      expect(calculator.multiply(2.5, 4)).toBe(10);
    });
  });

  describe('Division', () => {
    test('should divide two positive numbers', () => {
      expect(calculator.divide(10, 2)).toBe(5);
    });

    test('should handle decimal results', () => {
      expect(calculator.divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => calculator.divide(10, 0)).toThrow('Cannot divide by zero');
    });

    test('should divide negative numbers', () => {
      expect(calculator.divide(-10, 2)).toBe(-5);
    });
  });

  describe('Clear and Reset', () => {
    test('should clear the current value', () => {
      calculator.add(5, 3);
      calculator.clear();
      expect(calculator.getCurrentValue()).toBe(0);
    });

    test('should reset to initial state', () => {
      calculator.add(5, 3);
      calculator.reset();
      expect(calculator.getCurrentValue()).toBe(0);
    });
  });


  describe('Current Value Management', () => {
    test('should set and get current value', () => {
      calculator.setCurrentValue(123);
      expect(calculator.getCurrentValue()).toBe(123);
    });

    test('should initialize with zero', () => {
      expect(calculator.getCurrentValue()).toBe(0);
    });
  });
});