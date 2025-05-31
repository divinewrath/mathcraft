<script lang="ts">
    type Operands = {
        leftOperand: number;
        rightOperand: number;
    };

    type Action = (operands: Operands) => number;

    const {
        initialOperands,
        action,
        blockId,
        onBlockClick
    } = $props<{
        initialOperands: Operands;
        action: Action;
        blockId: symbol;
        onBlockClick: (details: { question: string; answer: number; blockId: symbol }) => void;
    }>();

    let solved = $state(false);
    const currentOperands = initialOperands;

    function getOperatorSymbol(fn: Action): '×' | '÷' {
        // @ts-ignore
        return fn.op === '×' ? '×' : '÷';
    }

    function getQuestionText(): string {
        const operator = getOperatorSymbol(action);
        if (action.name === 'div') {
            return `${currentOperands.leftOperand * currentOperands.rightOperand} ${operator} ${currentOperands.rightOperand}`;
        }

        return `${currentOperands.leftOperand} ${operator} ${currentOperands.rightOperand}`;
    }

    function calculateAnswer(): number {
        if (action.name === 'div') {
            return currentOperands.leftOperand;
        }
        return action(currentOperands);
    }

    function handleClick() {
        if (!solved) {
            onBlockClick({
                question: getQuestionText(),
                answer: calculateAnswer(),
                blockId: blockId
            });
        }
    }

    export function markAsSolved() {
        solved = true;
    }

</script>

<button
        class="block"
        aria-label={solved ? "Blok rozwiązany" : `Pytanie: ${getQuestionText()}`}
        onclick={handleClick}
        class:solved={solved}
        disabled={solved}
>
    {solved ? '✓' : '?'}
</button>

<style>
    .block {
        width: 64px;
        height: 64px;
        background-image: url('/assets/tiles/Grass.PNG');
        background-size: cover;
        cursor: pointer;
        border: 1px solid #5a8a3c;
        font-size: 28px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 3px black, 0 0 3px black;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .block:hover:not(.solved) {
        filter: brightness(1.1);
    }

    .solved {
        background-image: url('/assets/tiles/Stone.PNG');
        cursor: default;
    }
</style>