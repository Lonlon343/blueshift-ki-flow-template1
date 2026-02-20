<svelte:options runes={false} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { ArrowUpRight, Menu, MoonStar, SunMedium, X } from 'lucide-svelte';
	import { menuOpen, theme, toggleTheme } from '$lib/stores/ui';
	import fluxwerkLogo from '$lib/assets/Fluxwerk Logo.png';

	type NavItem = {
		label: string;
		href: string;
	};

	const navItems: NavItem[] = [
		{ label: 'Konzept', href: '#capabilities' },
		{ label: 'Modell', href: '#services' },
		{ label: 'Engpässe', href: '#work' },
		{ label: 'Beispiel-Flow', href: '#flow' }
	];

	let hasFinePointer = false;
	let activeHref = navItems[0]?.href ?? '';

	const cursorX = spring(0, { stiffness: 0.16, damping: 0.42 });
	const cursorY = spring(0, { stiffness: 0.16, damping: 0.42 });
	const cursorScale = spring(1, { stiffness: 0.16, damping: 0.38 });

	function toggleMenu(): void {
		menuOpen.update((value: boolean) => !value);
	}

	function closeMenu(): void {
		menuOpen.set(false);
	}

	function setActive(href: string): void {
		activeHref = href;
		closeMenu();
	}

	onMount(() => {
		hasFinePointer = window.matchMedia('(pointer: fine)').matches;

		const updateActiveLink = () => {
			const scrollCursor = window.scrollY + 180;
			let matched = navItems[0]?.href ?? '';

			for (const item of navItems) {
				const section = document.querySelector<HTMLElement>(item.href);
				if (!section) {
					continue;
				}

				if (section.offsetTop <= scrollCursor) {
					matched = item.href;
				}
			}

			const hash = window.location.hash;
			activeHref = navItems.some((item) => item.href === hash) ? hash : matched;
		};

		const onPointerMove = (event: PointerEvent) => {
			cursorX.set(event.clientX);
			cursorY.set(event.clientY);
		};

		const onInteractiveEnter = () => cursorScale.set(1.8);
		const onInteractiveLeave = () => cursorScale.set(1);

		const interactiveNodes = Array.from(document.querySelectorAll('a, button')) as HTMLElement[];

		window.addEventListener('scroll', updateActiveLink, { passive: true });
		window.addEventListener('hashchange', updateActiveLink);
		updateActiveLink();

		if (hasFinePointer) {
			window.addEventListener('pointermove', onPointerMove, { passive: true });
			for (const node of interactiveNodes) {
				node.addEventListener('pointerenter', onInteractiveEnter);
				node.addEventListener('pointerleave', onInteractiveLeave);
			}
		}

		return () => {
			window.removeEventListener('scroll', updateActiveLink);
			window.removeEventListener('hashchange', updateActiveLink);
			if (hasFinePointer) {
				window.removeEventListener('pointermove', onPointerMove);
				for (const node of interactiveNodes) {
					node.removeEventListener('pointerenter', onInteractiveEnter);
					node.removeEventListener('pointerleave', onInteractiveLeave);
				}
			}
		};
	});
</script>

<header class="sticky top-0 z-50 border-b border-slate-100 px-4 py-4 text-slate-900">
	<div
		class="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 shadow-[0_10px_35px_rgba(15,23,42,0.07)] backdrop-blur-md sm:px-6"
	>
		<a href="/" class="flex items-center gap-3 text-slate-900">
			<img src={fluxwerkLogo} alt="FLUXWERK Logo" class="h-12 w-auto rounded-md object-contain sm:h-14" />
			<div class="hidden leading-tight sm:block">
				<p class="text-xs font-bold uppercase tracking-[0.2em]">FLUXWERK</p>
				<p class="text-[10px] uppercase tracking-[0.14em] text-slate-600">Installiert &amp; Integriert</p>
			</div>
		</a>

		<nav class="hidden items-center gap-8 md:flex">
			{#each navItems as item}
				<a
					href={item.href}
					on:click={() => setActive(item.href)}
					class={`group flex items-center gap-1 text-xs uppercase tracking-[0.16em] transition-colors duration-300 ${
						activeHref === item.href
							? 'font-bold text-slate-900 underline decoration-2 underline-offset-4'
							: 'text-slate-600 hover:text-emerald-600'
					}`}
				>
					{item.label}
					<ArrowUpRight class="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
				</a>
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<button
				type="button"
				on:click={toggleTheme}
				class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-900 transition-transform duration-300 hover:scale-105"
				aria-label="Farbmodus wechseln"
			>
				{#if $theme}
					<SunMedium class="size-4" />
				{:else}
					<MoonStar class="size-4" />
				{/if}
			</button>

			<button
				type="button"
				on:click={toggleMenu}
				class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-900 md:hidden"
				aria-label="Navigationsmenue umschalten"
				aria-expanded={$menuOpen}
			>
				{#if $menuOpen}
					<X class="size-5" />
				{:else}
					<Menu class="size-5" />
				{/if}
			</button>
		</div>
	</div>

	{#if $menuOpen}
		<div
			class="mx-auto mt-3 w-full max-w-7xl rounded-3xl border border-slate-200 bg-white/95 p-4 text-slate-900 md:hidden"
			transition:fade={{ duration: 180 }}
		>
			<nav class="grid gap-2">
				{#each navItems as item}
					<a
						href={item.href}
						on:click={() => setActive(item.href)}
						class={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm uppercase tracking-[0.14em] transition-colors duration-300 ${
							activeHref === item.href
								? 'border-slate-300 bg-slate-50 font-bold text-slate-900 underline decoration-2 underline-offset-4'
								: 'border-transparent text-slate-600 hover:border-slate-200 hover:text-emerald-600'
						}`}
					>
						{item.label}
						<ArrowUpRight class="size-4" />
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>

{#if hasFinePointer}
	<div
		aria-hidden="true"
		class="pointer-events-none fixed left-0 top-0 z-[100] hidden h-6 w-6 rounded-full border border-slate-900/35 bg-slate-900/8 md:block"
		style="transform: translate3d({$cursorX}px, {$cursorY}px, 0) translate(-50%, -50%) scale({$cursorScale});"
	></div>
{/if}
