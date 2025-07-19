import { AbstractGenerator } from "$lib/questions/AbstractGenerator";
import type { QuestionData } from "$lib/types";

export class DivGenerator extends AbstractGenerator {
    public generate(): QuestionData {
        let divisor: number = this.randomInt(this.limit);
        let dividend: number = this.randomInt(this.limit) * divisor;

        return {
            operands: {
                leftOperand: dividend,
                rightOperand: divisor,
            },
            operation: 'div',
        }
    }
}
