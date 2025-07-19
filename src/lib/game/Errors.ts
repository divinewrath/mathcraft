export class GameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class InvalidInputError extends GameError {}
export class IncorrectAnswerError extends GameError {}
