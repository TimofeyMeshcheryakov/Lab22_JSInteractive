
export class Calculator {
    constructor(displayElement) {
        this.display = displayElement;
        this.expression = '';
        this.hasError = false;
    }

    
    init(buttons) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleButtonClick(button.textContent);
            });
        });
    }

   
    handleButtonClick(value) {
       
        if (this.hasError && value !== 'C') {
            this.clear();
        }

        if (value === 'C') {
            this.clear();
        } else if (value === '=') {
            this.calculate();
        } else {
            this.addToExpression(value);
        }
    }

    
    addToExpression(value) {
       
        if (this.expression === '' && this.isOperator(value) && value !== '-') {
            return;
        }

        
        if (this.isOperator(value) && this.isLastCharOperator()) {
           
            this.expression = this.expression.slice(0, -1) + value;
            this.updateDisplay();
            return;
        }

       
        if (value === '.' && this.hasDuplicateDot()) {
            return;
        }

        this.expression += value;
        this.updateDisplay();
    }

    
    calculate() {
        if (!this.isValidExpression()) {
            this.showError();
            return;
        }

        try {
            const result = this.safeEvaluate(this.expression);
            
           
            if (!isFinite(result)) {
                throw new Error("Деление на ноль");
            }

            this.expression = result.toString();
            this.hasError = false;
            this.updateDisplay();
        } catch (error) {
            this.showError();
        }
    }

   
    safeEvaluate(expr) {
        
        if (/[^0-9+\-*/().]/.test(expr)) {
            throw new Error("Недопустимые символы");
        }
        return eval(expr);
    }

    
    isValidExpression() {
        if (this.expression === '') return false;
        if (this.isLastCharOperator()) return false;
        return true;
    }

    
    clear() {
        this.expression = '';
        this.hasError = false;
        this.updateDisplay();
    }

    
    updateDisplay() {
        this.display.value = this.expression === '' ? '0' : this.expression;
    }

    
    showError() {
        this.display.value = 'Ошибка';
        this.hasError = true;
        this.expression = ''; 
    }


    isOperator(char) {
        return ['+', '-', '*', '/'].includes(char);
    }


    isLastCharOperator() {
        if (this.expression.length === 0) return false;
        const lastChar = this.expression.slice(-1);
        return this.isOperator(lastChar);
    }

    
    hasDuplicateDot() {
        const parts = this.expression.split(/[\+\-\*\/]/);
        const currentNumber = parts[parts.length - 1];
        return currentNumber.includes('.');
    }
}