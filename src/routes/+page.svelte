<script lang="ts">
    import { version, dev } from '$app/environment';
    import BlockGrid from '$lib/components/BlockGrid.svelte';
    import Inventory from '$lib/components/Inventory.svelte';
    import QuestionModal from '$lib/components/QuestionModal.svelte';
    import Block from "$lib/components/Block.svelte";
    import { MulGenerator } from '$lib/questions/MulGenerator';
    import { DivGenerator } from "$lib/questions/DivGenerator";
    import Rotozoomer from '$lib/components/Rotozoomer.svelte';

    type Operands = {
        leftOperand: number;
        rightOperand: number;
    };

    type ActionFn = (operands: Operands) => number;
    // type BlockComponentInstance = InstanceType<typeof Block>;
    type BlockComponentInstance = Block;

    interface BlockData {
        id: symbol;
        operands: Operands;
        action: ActionFn;
        ref?: BlockComponentInstance;
    }

    const MAX_HEARTS = 3;
    let diamonds = $state(0);
    let hearts = $state(MAX_HEARTS);

    let showModal = $state(false);
    let activeQuestionData = $state<{
        question: string;
        answer: number;
        blockId: symbol;
        errorMessage?: string;
    } | null>(null);

    let generators = {'mul': new MulGenerator(10), 'div': new DivGenerator(10)};

    let isStarted = $state<boolean>(false);
    let gameBlocks = $state<BlockData[]>([]);
    let gameOver = $state(false);
    let gameWon = $state(false);
    let solvedBlocksCount = $state(0);

    function generateOperands(): Operands {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;

        return { leftOperand: num1, rightOperand: num2 };
    }

    function getRandomGenerator(): any {
        return Math.random() > 0.5 ? generators.mul : generators.div;
    }

    function initializeBlocks() {
        const newBlocks: BlockData[] = [];
        const numberOfBlocks = 25;
        for (let i = 0; i < numberOfBlocks; i++) {
            let blockData = {
                id: Symbol(`block-${i}`),
            };

            let questionData = getRandomGenerator().generate();
            questionData = {
                operands: { ...questionData },
                action: questionData.action,
            }

            newBlocks.push({...blockData, ...questionData});
        }
        gameBlocks = newBlocks;
    }

    function startGame() {
        showModal = false;
        isStarted = true;
        gameOver = false;
        gameWon = false;
        diamonds = 0;
        hearts = MAX_HEARTS;
        solvedBlocksCount = 0;
        initializeBlocks();
    }

    function handleBlockClick(data: { question: string; answer: number; blockId: symbol }) {
        if (gameOver || gameWon) return;

        activeQuestionData = { ...data, errorMessage: '' };
        showModal = true;
    }

    function handleAnswerAttempt(userProvidedAnswerStr: string) {
        if (!activeQuestionData || gameOver || gameWon) return;

        const userAnswerNum = parseInt(userProvidedAnswerStr, 10);

        if (isNaN(userAnswerNum)) {
            activeQuestionData.errorMessage = "To nie jest poprawna liczba!";
            return;
        }

        if (userAnswerNum === activeQuestionData.answer) {
            diamonds++;
            solvedBlocksCount++;

            const blockToSolve = gameBlocks.find(b => b.id === activeQuestionData!.blockId);
            if (blockToSolve?.ref) {
                blockToSolve.ref.markAsSolved();
            }
            closeModal();

            if (solvedBlocksCount === gameBlocks.length) {
                gameWon = true;
            }
        } else {
            hearts--;
            activeQuestionData.errorMessage = "Zła odpowiedź. Spróbuj jeszcze raz!";
            if (hearts <= 0) {
                activeQuestionData.errorMessage = "Koniec gry! Zabrakło serc.";
                gameOver = true;
            }
        }
    }

    function closeModal() {
        showModal = false;
        activeQuestionData = null;
    }

</script>

<main>
    <div class="version-display">{dev ? 'dev-' : ''}{version}</div>
    <Rotozoomer>
        {#snippet children({ transformStyle })}
            <h1 style:transform={transformStyle}>MathCraft</h1>
<!--            <h1>MathCraft</h1>-->
        {/snippet}
    </Rotozoomer>
<!--    <img src="/icon-1024x1024.png" alt="MathCraft Logo" class="logo-image"/>-->
    {#if !isStarted}
        <button class="start-button" onclick={startGame}>Rozpocznij Grę</button>
    {:else}
        <Inventory {diamonds} {hearts} />

        {#if gameOver}
            <div class="game-over-message">
                <h2>Koniec Gry!</h2>
                <p>Zdobyłeś {diamonds} diamentów.</p>
                <button class="start-button" onclick={startGame}>Zagraj Ponownie</button>
            </div>
        {:else if gameWon}
            <div class="game-won-message">
                <h2>Gratulacje!</h2>
                <p>Ukończyłeś wszystkie zadania!</p>
                <p>Pozostałe serca: {'❤️'.repeat(hearts) || 'Brak'}</p>
                <button class="start-button" onclick={startGame}>Zagraj Ponownie</button>
            </div>
        {:else}
        <BlockGrid>
            {#each gameBlocks as blockItem (blockItem.id)}
                <Block
                        bind:this={blockItem.ref}
                        initialOperands={blockItem.operands}
                        action={blockItem.action}
                        blockId={blockItem.id}
                        onBlockClick={handleBlockClick}
                />
            {/each}
        </BlockGrid>
        {/if}

        {#if showModal && activeQuestionData && !gameOver && !gameWon}
            <QuestionModal
                    question={activeQuestionData.question}
                    errorMessage={activeQuestionData?.errorMessage}
                    onAnswer={handleAnswerAttempt}
                    onClose={closeModal}
            />
        {/if}
    {/if}
</main>

<style>
    main {
        font-family: 'Minecraftia', sans-serif;
        background-color: #8ecae6;
        padding: 20px;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .version-display {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 0.8em;
        color: #2c3e50;
        background-color: rgba(255, 255, 255, 0.5);
        padding: 2px 5px;
        border-radius: 3px;
    }

    .logo-image {
        width: 40dvh;
        height: 40dvh;
        margin-bottom: 20px;
        object-fit: contain;
    }

    h1 {
        color: #2c3e50;
        text-shadow: 2px 2px #ffffff;
        font-size: 3em;
        margin-bottom: 30px;
        /*animation-name: rotozoom;*/
        /*animation-duration: 10s;*/
        /*animation-iteration-count: infinite;*/
        /*animation-timing-function: linear;*/
        display: inline-block;
        /*will-change: transform, opacity, color;*/
    }

    /* Definicja animacji @keyframes dla rotozoom */
    @keyframes rotozoom {
        0% {
            transform: scale(0.7) rotate(0deg);
            opacity: 0.6;
            color: #2c3e50;
        }
        25% {
            transform: scale(1.1) rotate(15deg); /* Mniejszy kąt rotacji dla subtelniejszego efektu */
            opacity: 1;
            color: #e67e22; /* Pomarańczowy akcent */
        }
        50% {
            transform: scale(0.9) rotate(0deg);
            opacity: 0.8;
            color: #2980b9; /* Niebieski akcent */
        }
        75% {
            transform: scale(1.2) rotate(-15deg); /* Rotacja w przeciwnym kierunku */
            opacity: 1;
            color: #f1c40f; /* Żółty akcent */
        }
        100% {
            transform: scale(0.7) rotate(0deg);
            opacity: 0.6;
            color: #2c3e50; /* Powrót do stanu początkowego */
        }
    }

    .start-button {
        font-family: 'Minecraftia', sans-serif;
        padding: 15px 30px;
        font-size: 1.5em;
        color: white;
        background-color: #27ae60;
        border: 3px solid #2ecc71;
        box-shadow: 0 4px #16a085;
        cursor: pointer;
        text-shadow: 1px 1px #145a32;
        transition: all 0.1s ease;
        margin-top: 10px;
    }

    .start-button:active {
        box-shadow: 0 2px #16a085;
        transform: translateY(2px);
    }

    .game-over-message, .game-won-message {
        color: white;
        padding: 30px;
        text-align: center;
        box-shadow: 0 0 15px rgba(0,0,0,0.5);
    }

    .game-over-message {
        background-color: rgba(44, 62, 80, 0.9);
        border: 4px solid #c0392b;
    }

    .game-over-message h2 {
        font-size: 2.5em;
        color: #e74c3c;
        margin-bottom: 10px;
    }

    .game-over-message p {
        font-size: 1.2em;
        margin-bottom: 20px;
    }

    .game-won-message {
        background-color: rgba(39, 174, 96, 0.9);
        border: 4px solid #2ecc71;
    }

    .game-won-message h2 {
        font-size: 2.8em;
        color: #f1c40f;
        text-shadow: 1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000;
        margin-bottom: 15px;
    }

    .game-won-message p {
        font-size: 1.3em;
        margin-bottom: 10px;
        color: #fff;
    }
</style>
