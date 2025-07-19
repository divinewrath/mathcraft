import type { AbstractGenerator } from "$lib/questions/AbstractGenerator";
import type {ActiveQuestion, BlockData, QuestionData} from "$lib/types";
import { gameState } from '$lib/stores/GameState.svelte';
import { IncorrectAnswerError, InvalidInputError } from '$lib/game/Errors';

export class GameManager {
    public solvedBlocksCount: number = 0;

    MAX_BLOCKS: number = 25;
    generators: Array<AbstractGenerator> = [];

    constructor (generators: Array<AbstractGenerator>) {
        this.generators = generators;
    }

    public startGame() {
        this.solvedBlocksCount = 0;
        this.generateBlocks();
        gameState.startGame();
    }

    public generateBlocks() {
        gameState.blocks = [];
        for (let i = 0; i < this.MAX_BLOCKS; i++) {
            let blockData: BlockData = {
                id: Symbol(`block-${i}`),
                questionData: this.getRandomGenerator().generate(),
                markedAsSolved: false,
            };

            gameState.blocks.push(blockData);
        }
    }

    public handleAnswer(userProvidedAnswer: string) {
        if (!gameState.activeQuestion) return;

        const userAnswerNum = parseInt(userProvidedAnswer, 10);

        if (isNaN(userAnswerNum)) {
            throw new InvalidInputError("To nie jest poprawna liczba!");
        }

        if (userAnswerNum === gameState.activeQuestion.answer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    private handleCorrectAnswer(): void {
        gameState.diamonds++;
        this.solvedBlocksCount++;

        gameState.markAsSolvedById(gameState.activeQuestion!.blockId);
        this.closeModal();

        if (this.solvedBlocksCount === gameState.blocks.length) {
            gameState.gameWon = true;
        }
    }

    private handleIncorrectAnswer(): void {
        gameState.hearts--;
        if (gameState.hearts <= 0) {
            gameState.gameOver = true;
            throw new IncorrectAnswerError("Koniec gry! Zabrakło serc.");
        }
        throw new IncorrectAnswerError("Zła odpowiedź. Spróbuj jeszcze raz!");
    }

    public closeModal() {
        gameState.showModal = false;
        gameState.activeQuestion = null;
    }

    private getRandomGenerator(): AbstractGenerator {
        return this.generators[Math.floor(Math.random() * this.generators.length)]
    }

    public handleBlockClick(data: ActiveQuestion) {
        if (gameState.gameOver || gameState.gameWon) return;

        gameState.activeQuestion = { ...data };
        gameState.showModal = true;
    }
}
