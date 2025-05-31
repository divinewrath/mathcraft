import { AbstractGenerator } from "$lib/questions/AbstractGenerator";

export class DivGenerator extends AbstractGenerator{
    public generate() {
        let divisor: number = this.randomInt(this.limit);
        let dividend: number = this.randomInt(this.limit) * divisor;

        return {
            leftOperand: dividend,
            rightOperand: divisor,
            action: 'div',
            op: '÷',
        }
    }
}
