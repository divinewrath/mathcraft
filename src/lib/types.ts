export type Operands = {
    leftOperand: number;
    rightOperand: number;
};

export type Operation = 'div' | 'mul';

export type BlockData = {
    id: symbol;
    questionData: QuestionData,
    markedAsSolved: boolean,
}

export type QuestionData = {
    operation: Operation,
    operands: Operands,
}

export type ActiveQuestion = {
    question: string;
    answer: number;
    blockId: symbol;
};
