<script lang="ts">
    const { children } = $props();
</script>

<div class="grid">
    {@render children()}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(5, 64px);
        grid-gap: 1px;
    }
</style>
