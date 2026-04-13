# TDD Calculator

A simple calculator built using Test-Driven Development (TDD) methodology with Jest testing framework.

## 🎯 Project Overview

This project demonstrates the TDD approach by:
1. Writing comprehensive tests first (Red phase)
2. Implementing code to pass tests (Green phase)
3. Refactoring for better code quality (Refactor phase)

## 🚀 Features

### Core Operations
- Addition (+)
- Subtraction (−)
- Multiplication (×)
- Division (÷)

### Memory Functions
- **MS** - Memory Store: Save current value to memory
- **MR** - Memory Recall: Retrieve value from memory
- **MC** - Memory Clear: Clear memory
- **M+** - Memory Add: Add current value to memory

### Additional Features
- Decimal point support
- Negative number toggle (±)
- Backspace functionality (⌫)
- Clear function (C)
- Keyboard support
- Error handling (division by zero)

## 📁 Project Structure

```
calculator-tdd/
├── calculator.js           # Core calculator logic
├── calculator.test.js      # Jest test suite (TDD tests)
├── app.js                  # UI controller
├── index.html              # HTML structure
├── style.css               # Styling
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🧪 Running Tests

### Installation

```bash
npm install
```

### Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## 🎨 Running the Calculator

Simply open `index.html` in your web browser. No build process required!

```bash
# Using a simple HTTP server (recommended)
npx serve .

# Or just open the file
open index.html
```

## ⌨️ Keyboard Shortcuts

- **Numbers**: 0-9
- **Operations**: +, -, *, /
- **Equals**: Enter or =
- **Clear**: Escape or C
- **Backspace**: Backspace
- **Decimal**: .

## 🛠️ Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling with modern features (Grid, Flexbox, Gradients)
- **JavaScript (ES6+)** - Logic and interactivity
- **Jest** - Testing framework
- **jsdom** - DOM testing environment

## 📝 Code Quality

- ✅ All code tested before implementation
- ✅ Clear separation of concerns
- ✅ Modular architecture
- ✅ Error handling
- ✅ Responsive design
- ✅ Keyboard accessibility

## 🎓 Learning Outcomes

This project demonstrates:
- Test-Driven Development methodology
- Unit testing with Jest
- DOM manipulation
- Event handling
- State management
- Error handling
- Responsive UI design

## 📄 License

MIT License - Feel free to use this for learning purposes!

---

Built with ❤️ using TDD methodology