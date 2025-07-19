<script lang="ts">
    let {
        title
    } = $props();

    let step = $state(0);

    const rotate = $derived(Math.cos(step * 0.0002) * 360);
    const scale = $derived((Math.sin(step * 0.0002) * 0.5) + 1);
    let isPaused = $state(true);

    const transformStyle = $derived(
        `rotate(${rotate}deg) scale(${scale})`
    );

    $effect(() => {
        let animationFrameId: number;

        const frame = () => {
            if (!isPaused) {
                step += 20;
            }

            animationFrameId = requestAnimationFrame(frame);
        };

        animationFrameId = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    });
    let handlePause = () => {
        isPaused = !isPaused;
        step = 0;
    };
</script>

<div onclick={handlePause} onkeyup={handlePause} role="button" tabindex="0">
    <h1 style:transform={transformStyle}>{title}</h1>
</div>

<style>
    h1 {
        color: #2c3e50;
        text-shadow: 2px 2px #ffffff;
        font-size: 3em;
        margin-bottom: 30px;
        display: inline-block;
    }
</style>
