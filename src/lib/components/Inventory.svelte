<script lang="ts">
    const { diamonds, hearts } = $props<{
        diamonds: number;
        hearts: number;
    }>();
</script>

<div class="inventory">
    <div>💎: {diamonds}</div>
    <div>❤️: {hearts}</div>
</div>

<style>
    .inventory {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 1.5em;
        color: #333;
        background-color: rgba(255, 255, 255, 0.7);
        padding: 10px 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .inventory div {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
</style>
