<svelte:options runes={false} />

<script lang="ts">
	export let size: string | number = 24;
	export let color = 'currentColor';
	export let strokeWidth: string | number = 2;
	export let absoluteStrokeWidth = false;

	$: numericSize = typeof size === 'number' ? size : Number.parseFloat(size);
	$: resolvedStrokeWidth =
		absoluteStrokeWidth && Number.isFinite(numericSize)
			? (Number(strokeWidth) * 24) / numericSize
			: strokeWidth;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width={resolvedStrokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	width={size}
	height={size}
	{...$$restProps}
>
	<slot />
</svg>
