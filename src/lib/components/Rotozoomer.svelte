<script lang="ts">
    let { children } = $props();

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

<div onclick={handlePause}>
    {@render children?.({ transformStyle: transformStyle })}
</div>
