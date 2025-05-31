import { AbstractGenerator } from "$lib/questions/AbstractGenerator";

export class MulGenerator extends AbstractGenerator{
    public generate() {
        return {
            leftOperand: Math.floor(Math.random() * this.limit) + 1,
            rightOperand: Math.floor(Math.random() * this.limit) + 1,
            action: 'mul',
            op: '×',
        }
    }
}
