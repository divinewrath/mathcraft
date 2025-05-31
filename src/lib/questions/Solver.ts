export class Solver {
    public solve(leftOperand: number, rightOperand: number, action: 'mul' | 'div'): number {
        if (action === 'mul') {
            return leftOperand * rightOperand;
        } else if (action === 'div') {
            return leftOperand / rightOperand;
        }

        throw new Error('Illegal action');
    }
}
