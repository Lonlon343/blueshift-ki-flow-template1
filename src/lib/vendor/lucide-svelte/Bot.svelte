<svelte:options runes={false} />

<script lang="ts">
	import IconBase from './IconBase.svelte';
</script>

<IconBase {...$$props}>
	<path d="M12 8V4"></path>
	<rect x="3" y="8" width="18" height="12" rx="2"></rect>
	<path d="M9 13h.01"></path>
	<path d="M15 13h.01"></path>
	<path d="M8 17h8"></path>
</IconBase>
