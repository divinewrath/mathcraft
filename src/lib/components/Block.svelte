<script lang="ts">
    import { Solver } from "$lib/questions/Solver";
    import type {BlockData, QuestionData} from "$lib/types";

    type BlockProps = {
        blockItem: BlockData,
        onBlockClick: (details: { question: string; answer: number; blockId: symbol }) => void;
    };

    const {
        blockItem,
        onBlockClick
    }: BlockProps = $props();

    let question = blockItem.questionData;

    const solver = new Solver();

    function getOpSymbol(operation: string) {
        let map = new Map([['div', '÷'], ['mul', '×']]);

        return map.get(operation);
    }

    function getQuestionText(): string {
        let op = getOpSymbol(question.operation) ?? '?';

        return `${question.operands.leftOperand} ${op} ${question.operands.rightOperand}`;
    }

    function calculateAnswer(): number {
        return solver.solve(question.operands.leftOperand, question.operands.rightOperand, question.operation);
    }

    function handleClick() {
        if (!blockItem.markedAsSolved) {
            onBlockClick({
                question: getQuestionText(),
                answer: calculateAnswer(),
                blockId: blockItem.id
            });
        }
    }
</script>

<button
        class="block"
        aria-label={blockItem.markedAsSolved ? "Blok rozwiązany" : `Pytanie: ${getQuestionText()}`}
        onclick={handleClick}
        class:solved={blockItem.markedAsSolved}
        disabled={blockItem.markedAsSolved}
>
    {blockItem.markedAsSolved ? '✓' : '?'}
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