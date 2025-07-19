import { AbstractGenerator } from "$lib/questions/AbstractGenerator";
import type { QuestionData } from "$lib/types";

export class MulGenerator extends AbstractGenerator{
    public generate(): QuestionData {
        return {
            operands: {
                leftOperand: Math.floor(Math.random() * this.limit) + 1,
                rightOperand: Math.floor(Math.random() * this.limit) + 1,
            },
            operation: 'mul',
        }
    }
}
