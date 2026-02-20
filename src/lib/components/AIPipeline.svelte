<svelte:options runes={false} />

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { CheckCircle, Label, Play, Zap } from 'lucide-svelte';

	type Step = {
		id: number;
		name: string;
		icon: typeof Label;
		color: string;
	};

	const progress = tweened(0, { duration: 1000, easing: cubicOut });
	const dispatch = createEventDispatcher<{ complete: void }>();

	const steps: Step[] = [
		{ id: 1, name: 'Kundenmail', icon: Label, color: 'text-sky-500' },
		{ id: 2, name: 'KI-Pruefung', icon: Zap, color: 'text-emerald-500' },
		{ id: 3, name: 'CRM-Entwurf', icon: Label, color: 'text-sky-500' },
		{ id: 4, name: 'Freigabe', icon: CheckCircle, color: 'text-emerald-500' }
	];

	let activeStep = 0;
	let isStarted = false;
	let isRunning = false;
	let isComplete = false;

	$: progressWidth = `${$progress}%`;

	async function runPipeline(): Promise<void> {
		if (isRunning) {
			return;
		}

		isStarted = true;
		isComplete = false;
		isRunning = true;
		progress.set(0, { duration: 0 });
		activeStep = 0;

		for (let i = 1; i <= steps.length; i += 1) {
			await new Promise((resolve) => window.setTimeout(resolve, 800));
			activeStep = i;
			progress.set((i / steps.length) * 100);
		}

		isRunning = false;
		isComplete = true;
		await new Promise((resolve) => window.setTimeout(resolve, 1500));
		dispatch('complete');
	}

	function handleContainerClick(event: MouseEvent): void {
		if (event.target instanceof HTMLButtonElement) {
			return;
		}

		if (!isStarted) {
			void runPipeline();
		}
	}
</script>

<div
	class="relative cursor-pointer"
	on:click={handleContainerClick}
	role="button"
	tabindex="0"
	on:keydown={(event) => event.key === 'Enter' && !isStarted && runPipeline()}
>
	<div class="flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-elevated)] p-8 text-[var(--text)] shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-12">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-black uppercase tracking-tighter text-[var(--text)] sm:text-5xl">
				Beispiel: <span class="text-[var(--accent)]">Mail-zu-CRM</span>-Flow
			</h2>
			<p class="text-base font-light tracking-wide text-[var(--text-soft)] sm:text-lg">
				Klicken Sie und sehen Sie, wie ein wiederkehrender Vorgang ohne Grossprojekt automatisiert wird.
			</p>
		</div>

		<div class="relative flex w-full max-w-4xl items-center justify-between px-2 sm:px-4">
			<div class="absolute left-0 top-1/2 z-0 h-[2px] w-full -translate-y-1/2 bg-[var(--muted)]">
				<div
					class="h-full bg-[var(--accent)] shadow-[0_0_14px_rgba(255,90,43,0.35)] transition-all duration-300"
					style={`width: ${progressWidth};`}
				></div>
			</div>

			{#each steps as step, i}
				<div class="group relative z-10 flex flex-col items-center">
					<div
						class={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-500 sm:h-16 sm:w-16 ${
							activeStep >= i + 1
								? `scale-110 border-[var(--line)] bg-[var(--surface-elevated)] ${step.color} shadow-xl`
								: 'border-[var(--line)] bg-[var(--muted)] text-[var(--text-soft)]'
						} ${!isStarted && i === 0 ? 'animate-pulse' : ''}`}
					>
						<svelte:component this={step.icon} size={26} strokeWidth={2.5} />
					</div>

					<span
						class={`absolute -bottom-10 text-[10px] font-bold uppercase tracking-widest sm:text-xs ${
							activeStep >= i + 1 ? 'text-[var(--text)]' : 'text-[var(--text-soft)]'
						}`}
					>
						{step.name}
					</span>
				</div>
			{/each}
		</div>

		<div class="mt-24 flex flex-wrap justify-center gap-3">
			<button
				type="button"
				on:click={runPipeline}
				disabled={isRunning}
				class="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-4 font-black uppercase tracking-widest text-white shadow-lg transition-colors hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
			>
				<Play class="size-4" strokeWidth={2.5} />
				{isRunning ? 'Laeuft...' : isStarted ? 'Erneut starten' : 'Prozess starten'}
			</button>
			{#if !isStarted}
				<p class="self-center text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">
					Interaktive Vorschau
				</p>
			{/if}
		</div>

		{#if isComplete}
			<div in:fly={{ y: 20, duration: 500 }} class="mt-8 font-mono text-sm text-[var(--accent)]">
				[ERFOLG] Entwurf liegt im CRM. Team klickt nur noch auf Senden.
			</div>
		{/if}
	</div>
</div>
