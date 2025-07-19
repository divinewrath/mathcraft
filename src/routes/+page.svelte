<script lang="ts">
    import { version, dev } from '$app/environment';
    import BlockGrid from '$lib/components/BlockGrid.svelte';
    import Inventory from '$lib/components/Inventory.svelte';
    import QuestionModal from '$lib/components/QuestionModal.svelte';
    import Block from "$lib/components/Block.svelte";
    import Back from "$lib/components/Back.svelte"

    import { MulGenerator } from '$lib/questions/MulGenerator';
    import { DivGenerator } from "$lib/questions/DivGenerator";
    import { gameState } from '$lib/stores/GameState.svelte';
    import { GameManager } from '$lib/game/GameManager';

    let game = new GameManager([new MulGenerator(10), new DivGenerator(10)]);

    function startGame() {
        game.startGame();
    }

    function startTimeLimitGame() {
        console.log('time limit');
    }
</script>

<main>
    <div class="version-display">{dev ? 'dev-' : ''}{version}</div>
    {#if !gameState.isStarted}
        <h1>MathCraft</h1>
        <button class="button start-button" onclick={startGame}>Rozpocznij Grę</button>
        <button class="button time-limit-button" onclick={startTimeLimitGame}>Gra na czas</button>
    {:else}
        <Back backHandler={() => { gameState.isStarted = false; }} />
        <Inventory diamonds={gameState.diamonds} hearts={gameState.hearts} />

        {#if gameState.gameOver}
            <div class="game-over-message">
                <h2>Koniec Gry!</h2>
                <p>Zdobyłeś {gameState.diamonds} diamentów.</p>
                <button class="start-button" onclick={startGame}>Zagraj Ponownie</button>
            </div>
        {:else if gameState.gameWon}
            <div class="game-won-message">
                <h2>Gratulacje!</h2>
                <p>Ukończyłeś wszystkie zadania!</p>
                <p>Pozostałe serca: {'❤️'.repeat(gameState.hearts) || 'Brak'}</p>
                <button class="start-button" onclick={startGame}>Zagraj Ponownie</button>
            </div>
        {:else}
        <BlockGrid>
            {#each gameState.blocks as blockItem (blockItem.id)}
                <Block
                        blockItem={blockItem}
                        onBlockClick={game.handleBlockClick}
                />
            {/each}
        </BlockGrid>
        {/if}

        {#if gameState.canShowModal}
            <QuestionModal
                    question={gameState.activeQuestion?.question}
                    onAnswer={(data) => { game.handleAnswer(data) }}
                    onClose={() => { game.closeModal() }}
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

    h1 {
        color: #2c3e50;
        text-shadow: 2px 2px #ffffff;
        font-size: 3em;
        margin-bottom: 30px;
        display: inline-block;
    }

    .button {
        font-family: 'Minecraftia', sans-serif;
        font-size: 1.5em;
        cursor: pointer;
        transition: all 0.1s ease;
        width: 90vw;
        color: white;
        margin-top: 50px;
        padding: 30px 0;

        background-color: var(--background-color);
        border: 3px solid var(--border-color);
        box-shadow: 0 4px var(--shadow-color);
        text-shadow: 1px 1px var(--text-shadow-color);

        &:active {
            box-shadow: 0 2px var(--shadow-color);
            transform: translateY(2px);
        }
    }

    .start-button {
        --background-color: #27ae60;
        --border-color: #2ecc71;
        --shadow-color: #16a085;
    }

    .time-limit-button {
        --background-color: #d07e3d;
        --border-color: #ce9263;
        --shadow-color: #945a2b;
    }

/**
    .quit-button {
        --background-color: #c41919;
        --border-color: #c23d3d;
        --shadow-color: #be3152;
    }
**/

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
