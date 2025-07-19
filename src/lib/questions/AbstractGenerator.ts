import type { QuestionData } from "$lib/types";

export abstract class AbstractGenerator {
    protected readonly limit: number;

    constructor(limit: number) {
        this.limit = limit;
    }

    protected range(start: number, stop: number, step: number = 1): number[] {
        return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    }

    protected randomInt(limit: number): number {
        return Math.floor(Math.random() * limit) + 1;
    }

    public abstract generate(): QuestionData;
}
