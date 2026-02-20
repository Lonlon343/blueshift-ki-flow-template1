<svelte:options runes={false} />

<script lang="ts">
	import IconBase from './IconBase.svelte';
</script>

<IconBase {...$$props}>
	<rect x="3" y="4" width="5" height="5" rx="1"></rect>
	<rect x="16" y="4" width="5" height="5" rx="1"></rect>
	<rect x="16" y="15" width="5" height="5" rx="1"></rect>
	<path d="M8 6.5h4"></path>
	<path d="M12 6.5v10H16"></path>
</IconBase>
