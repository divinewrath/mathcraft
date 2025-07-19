import type { ActiveQuestion, BlockData } from "$lib/types";

class GameState {
    MAX_HEARTS: number = 3;

    isStarted: boolean = $state<boolean>(false);
    gameOver: boolean = $state<boolean>(false);
    gameWon: boolean = $state<boolean>(false);
    showModal: boolean = $state<boolean>(false);
    diamonds: number = $state<number>(0);
    hearts: number = $state<number>(this.MAX_HEARTS);
    activeQuestion: ActiveQuestion | null = $state<ActiveQuestion | null>(null);
    blocks: BlockData[] = $state([]);

    canShowModal: boolean = $derived.by(() => {
        return !!(this.showModal && this.activeQuestion && !this.gameOver);
    })

    startGame() {
        this.reset();
        this.isStarted = true;
    }

    reset() {
        this.isStarted = false;
        this.gameOver = false;
        this.gameWon = false;
        this.diamonds = 0;
        this.hearts = this.MAX_HEARTS;
        this.activeQuestion = null;
    }

    markAsSolvedById(blockId: symbol) {
        const blockToMark = this.blocks.find(b => b.id === blockId);
        if(blockToMark) {
            blockToMark.markedAsSolved = true;
        }
    }
}

export const gameState = new GameState();
