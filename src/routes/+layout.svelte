<svelte:options runes={false} />

<script lang="ts">
	import '../app.css';
	import fluxwerkLogo from '$lib/assets/Fluxwerk Logo.png';
	import Navigation from '$lib/components/Navigation.svelte';
	import { page } from '$app/stores';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { applyTheme, bootstrapTheme, theme } from '$lib/stores/ui';

	let isRouting = false;
	let pulseKey = 0;

	$: currentPath = $page.url.pathname;
	$: applyTheme($theme);

	onMount(() => {
		bootstrapTheme();
	});

	beforeNavigate(() => {
		isRouting = true;
		pulseKey += 1;
	});

	afterNavigate(() => {
		window.setTimeout(() => {
			isRouting = false;
		}, 260);
	});
</script>

<svelte:head>
	<link rel="icon" href={fluxwerkLogo} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
		rel="stylesheet"
	/>
	<script>
		(() => {
			try {
				const stored = localStorage.getItem('theme');
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				const isDark = stored ? stored === 'dark' : prefersDark;
				const root = document.documentElement;
				root.classList.toggle('dark', isDark);
				root.dataset.theme = isDark ? 'dark' : 'light';
				root.style.colorScheme = isDark ? 'dark' : 'light';
			} catch {
				// no-op
			}
		})();
	</script>
</svelte:head>

<div class="min-h-screen bg-[var(--surface)] text-[var(--text)] transition-colors duration-500">
	<Navigation />

	{#if isRouting}
		<div
			class="pointer-events-none fixed inset-0 z-40 bg-[var(--surface)]/35 backdrop-blur-[1px]"
			in:fade={{ duration: 140 }}
			out:fade={{ duration: 220 }}
		></div>
		<div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden">
			{#key pulseKey}
				<span
					class="block h-full w-full origin-left bg-[var(--accent)] animate-[route_bar_420ms_cubic-bezier(0.25,0.8,0.25,1)_forwards]"
				></span>
			{/key}
		</div>
	{/if}

	<main class="relative z-10">
		{#key currentPath}
			<div in:fly={{ y: 32, duration: 500, easing: cubicOut }} out:fade={{ duration: 180 }}>
				<slot />
			</div>
		{/key}
	</main>
</div>

<style>
	@keyframes route_bar {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
</style>
