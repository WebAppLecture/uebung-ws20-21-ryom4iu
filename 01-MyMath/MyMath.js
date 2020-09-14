/**
 * 'export' ist nötig falls wir MyMath in einem anderen Modul importieren wollen.
 * 'class' legt fest dass es sich hierbei um eine Klasse handelt.
 * 'MyMath' ist der Name der Klasse.
 */
export class MyMath {

    /**
     * Der Konstruktor wird aufgerufen um neue Instanzen der Klasse zu generieren.
     * vgl. let myNumber = new MyMath(3);
     * 
     * @param value Unser Initialwert für den Wert von unserer MyMath Instanz.
     */
    constructor(value = 0) {
        // 'this' referenziert den Kontext in dem die aktuelle Funktion aufgerufen wird. 
        // Hier referenziert es die Instanz der Klasse MyMath die wir gerade erstellen.
        // mit 'value * 1' erzwingen wir, dass value als number gelesen wird.
        this.value = value * 1; 
    }

    add(value) {
        this.value += value * 1;
        return this;
    }

    subtract(value) {
        this.value -= value;
        return this;
    }

    multiply(value) {
        this.value *= value;
        return this;
    }

    divide(value) {
        if (value == 0) {
            console.error("Division by zero");
            return;
        }
        this.value /= value;
        return this;
    }

    pow(value) {
        if (value % 1) {
            console.error("pow() is currently only implemented for integral exponents")
            return;
        } else if (value < 0) {
            if (!this.value) {
                console.error("pow() on a value of zero with a negative exponent")
                return;
            }
            // cover negative exponents
            this.value = 1 / this.value;
            value = -value;
        }
        let x = 1;
        while (value--)
            x *= this.value;
        this.value = x;
        return this;
    }

    factorial() {
        if (this.value % 1 && this.value != 0 || this.value < 0) {
            console.error("faculty() is only defined for non-negative integers");
            return;
        }
        let n = 1;
        while (this.value > 1)
            n *= this.value--;
        this.value = n;
        return this;
    }
}
