<script>
    const { backHandler } = $props();

    function handleBack() {
        backHandler();
    }
</script>

<button
        onclick={handleBack}
        aria-label="Powrót"
        class="back-button"
>
    ←
</button>

<style>
    .back-button {
        border: none;
        background: none;
        font-size: 3em;
        cursor: pointer;
        padding: 8px 12px 8px 8px;
        border-radius: 8px;
        transition: background-color 0.2s;
    }

    .back-button:hover {
        background-color: #f5f5f5;
    }

    .back-button:active {
        background-color: #ebebeb;
    }
</style>

