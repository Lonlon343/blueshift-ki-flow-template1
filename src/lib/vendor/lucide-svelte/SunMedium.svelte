<svelte:options runes={false} />

<script lang="ts">
	import IconBase from './IconBase.svelte';
</script>

<IconBase {...$$props}>
	<circle cx="12" cy="12" r="4"></circle>
	<path d="M12 3v2"></path>
	<path d="M12 19v2"></path>
	<path d="M3 12h2"></path>
	<path d="M19 12h2"></path>
	<path d="m5.6 5.6 1.4 1.4"></path>
	<path d="m17 17 1.4 1.4"></path>
	<path d="m18.4 5.6-1.4 1.4"></path>
	<path d="m7 17-1.4 1.4"></path>
</IconBase>
