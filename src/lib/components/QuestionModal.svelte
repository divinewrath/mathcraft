<script lang="ts">
    import { tick } from 'svelte';

    const {
        question,
        onAnswer,
        onClose
    } = $props<{
        question: string | undefined;
        onAnswer: (userAnswer: string) => void;
        onClose: () => void;
    }>();

    let userAnswer = $state('');
    let answerInputRef: HTMLInputElement | undefined = $state();
    let errorMessage: string | null = $state(null);

    function submitAnswer() {
        try {
            onAnswer(userAnswer);
            errorMessage = null;
        } catch (e: any) {
            userAnswer = '';
            errorMessage = e.message;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            submitAnswer();
        }
    }

    function handleModalContentClick(event: MouseEvent|KeyboardEvent) {
        event.stopPropagation();
    }

    function handleKeyUp(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onClose();
        }
    }

    $effect(() => {
        if (answerInputRef) {
            tick().then(() => {
                if (answerInputRef) {
                    answerInputRef.focus();
                    answerInputRef.select();
                }
            });
        }
    });
</script>

<div class="modal-overlay" onclick={onClose} onkeyup={handleKeyUp} tabindex="0" role="button">
    <div class="modal-content" onclick={handleModalContentClick} onkeyup={handleModalContentClick} tabindex="0" role="button">
        <p>{question} = ?</p>
        <input
            type="number"
            bind:value={userAnswer}
            bind:this={answerInputRef}
            onkeydown={handleKeydown}
        />
        {#if errorMessage}
            <p class="error-message">{errorMessage}</p>
        {/if}
        <div class="modal-buttons">
            <button onclick={submitAnswer}>Sprawdź</button>
            <button onclick={onClose} class="cancel-button">Anuluj</button>
        </div>
    </div>
</div>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        font-family: 'Minecraftia', sans-serif;
    }

    .modal-content {
        background: #f0e6d2;
        padding: 25px;
        border: 4px solid #7a5c3e;
        border-radius: 0;
        min-width: 320px;
        box-shadow: 0 0 0 4px #c8b496, 0 0 15px rgba(0,0,0,0.5);
        text-align: center;
    }

    .modal-content p {
        margin-bottom: 15px;
        font-size: 1.2em;
        color: #4a3b2a;
    }

    .modal-content input {
        width: calc(100% - 20px);
        padding: 10px;
        margin-bottom: 15px;
        border: 2px solid #7a5c3e;
        background-color: #fffcf5;
        font-family: 'Minecraftia', sans-serif;
        font-size: 1.1em;
        text-align: center;
    }

    .error-message {
        color: #c0392b;
        font-size: 0.95em;
        margin-top: -10px;
        margin-bottom: 10px;
        min-height: 1.2em;
    }

    .modal-buttons {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .modal-buttons button {
        font-family: 'Minecraftia', sans-serif;
        padding: 10px 20px;
        cursor: pointer;
        border: 2px solid #7a5c3e;
        background-color: #9c8264;
        color: white;
        text-shadow: 1px 1px #504231;
        transition: background-color 0.2s;
    }

    .modal-buttons button:hover {
        background-color: #7a5c3e;
    }

    .modal-buttons button.cancel-button {
        background-color: #a87373;
    }
    .modal-buttons button.cancel-button:hover {
        background-color: #8f5959;
    }
</style>