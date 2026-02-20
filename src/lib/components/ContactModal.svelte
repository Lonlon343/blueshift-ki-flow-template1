<svelte:options runes={false} />

<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	export let open = false;

	let isSubmitting = false;
	let name = '';
	let company = '';
	let email = '';
	let interest = 'Flow-Check';

	function close(): void {
		open = false;
	}

	function onBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			close();
		}
	}

	async function onSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		if (isSubmitting) {
			return;
		}

		isSubmitting = true;
		await new Promise((resolve) => window.setTimeout(resolve, 1200));
		isSubmitting = false;
		close();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 px-6 backdrop-blur-sm"
		on:click={onBackdropClick}
		on:keydown={(event) => (event.key === 'Escape' || event.key === 'Enter') && close()}
		role="button"
		tabindex="0"
		aria-label="Hintergrund des Kontaktmodals schliessen"
		transition:fade={{ duration: 220 }}
	>
		<div
			class="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 text-slate-900 shadow-[0_35px_120px_rgba(15,23,42,0.25)] sm:p-9"
			transition:scale={{ duration: 260, start: 0.96 }}
		>
			<div class="mb-8 flex items-start justify-between gap-6">
				<div>
					<p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500">
						Unverbindlicher Einstieg
					</p>
					<h3 class="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
						Flow-Check anfragen
					</h3>
				</div>
				<button
					type="button"
					on:click={close}
					class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-900 transition-colors hover:border-emerald-500 hover:text-emerald-500"
					aria-label="Kontaktformular schliessen"
				>
					<X class="size-5" />
				</button>
			</div>

			<form class="space-y-6" on:submit={onSubmit}>
				<div>
					<label for="lead-name" class="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
						Name
					</label>
					<input
						id="lead-name"
						bind:value={name}
						required
						class="w-full border-0 border-b-2 border-slate-100 bg-transparent px-0 py-2 text-base text-slate-900 outline-none transition-colors focus:border-emerald-500"
						placeholder="Max Mustermann"
					/>
				</div>

				<div>
					<label for="lead-company" class="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
						Unternehmen
					</label>
					<input
						id="lead-company"
						bind:value={company}
						required
						class="w-full border-0 border-b-2 border-slate-100 bg-transparent px-0 py-2 text-base text-slate-900 outline-none transition-colors focus:border-emerald-500"
						placeholder="Beispiel GmbH"
					/>
				</div>

				<div>
					<label for="lead-email" class="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
						E-Mail
					</label>
					<input
						id="lead-email"
						type="email"
						bind:value={email}
						required
						class="w-full border-0 border-b-2 border-slate-100 bg-transparent px-0 py-2 text-base text-slate-900 outline-none transition-colors focus:border-emerald-500"
						placeholder="max@unternehmen.de"
					/>
				</div>

				<div>
					<label
						for="lead-interest"
						class="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
					>
						Gewuenschter Einstieg
					</label>
					<select
						id="lead-interest"
						bind:value={interest}
						class="w-full border-0 border-b-2 border-slate-100 bg-transparent px-0 py-2 text-base text-slate-900 outline-none transition-colors focus:border-emerald-500"
					>
						<option>Flow-Check</option>
						<option>Installation</option>
						<option>Wartung</option>
						<option>Komplettpaket</option>
					</select>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					class="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-black uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{#if isSubmitting}
						<span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
						Wird gesendet
					{:else}
						Flow-Check anfragen
					{/if}
				</button>
			</form>
		</div>
	</div>
{/if}
