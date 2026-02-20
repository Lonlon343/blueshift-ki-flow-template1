<svelte:options runes={false} />

<script lang="ts">
	import IconBase from './IconBase.svelte';
</script>

<IconBase {...$$props}>
	<ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
	<path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path>
	<path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>
</IconBase>
