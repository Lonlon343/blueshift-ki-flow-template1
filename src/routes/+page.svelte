<svelte:options runes={false} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import { ArrowRight, Database, Sparkles, Workflow } from 'lucide-svelte';
	import AIPipeline from '$lib/components/AIPipeline.svelte';
	import ContactModal from '$lib/components/ContactModal.svelte';
	import { reveal } from '$lib/actions/reveal.js';
	import fluxwerkLogo from '$lib/assets/Fluxwerk Logo.png';

	type Service = {
		title: string;
		details: string;
		icon: typeof Sparkles;
	};

	type CaseStudy = {
		title: string;
		industry: string;
		year: string;
		summary: string;
	};

	type CrmSnapshot = {
		pipeline: string;
		leads: number;
		responseRate: string;
		automations: number;
	};

	const services: Service[] = [
		{
			title: '1) Flow-Check',
			details:
				'Wir analysieren einen konkreten Engpass im Betrieb und waehlen das passende FLUX-Modul für schnelle Wirkung.',
			icon: Sparkles
		},
		{
			title: '2) Installation',
			details:
				'Wir integrieren die Automatik technisch in Ihre bestehende Landschaft, inklusive Outlook, ERP, CRM und Fachsystemen.',
			icon: Workflow
		},
		{
			title: '3) Wartung',
			details:
				'Wir halten Ihre Flows stabil, passen sie an Modell- und Software-Updates an und optimieren sie fortlaufend im Betrieb.',
			icon: Database
		}
	];

	const caseStudies: CaseStudy[] = [
		{
			title: 'Zu viele Kunden-E-Mails',
			industry: 'Service',
			year: 'FLUX-MODUL 01',
			summary:
				'Eingehende Mails werden automatisch analysiert, priorisiert und mit Antwortentwurf im CRM vorbereitet.'
		},
		{
			title: 'Angebote dauern zu lang',
			industry: 'Vertrieb',
			year: 'FLUX-MODUL 02',
			summary:
				'Daten aus Anfrage, ERP und Vorlagen werden gebuendelt, damit Ihr Team Angebote schneller und fehleraermer versendet.'
		},
		{
			title: 'KI-Tools sind nicht angebunden',
			industry: 'IT / Betrieb',
			year: 'FLUX-MODUL 03',
			summary:
				'Wir verbinden APIs und Alt-Systeme, damit ChatGPT-gestuetzte Logik mit SAP, Salesforce oder Datev sauber zusammenarbeitet.'
		},
		{
			title: 'Wissen haengt an Einzelpersonen',
			industry: 'Organisation',
			year: 'FLUX-MODUL 04',
			summary:
				'Standardprozesse werden als nachvollziehbare KI-Flows dokumentiert und automatisiert, statt nur im Kopf einzelner zu bleiben.'
		}
	];

	const crmSnapshotPromise: Promise<CrmSnapshot> = new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				pipeline: 'Mail-Eingang zu CRM-Entwurf',
				leads: 142,
				responseRate: '63%',
				automations: 12
			});
		}, 1300);
	});

	const flowProgress = tweened(0, { duration: 1900, easing: cubicInOut });

	let revealHero = false;
	let heroOffsetX = 0;
	let heroOffsetY = 0;
	let activeCase: number | null = null;
	let showModal = false;

	$: heroOrbTransform = `transform: translate3d(${heroOffsetX}px, ${heroOffsetY}px, 0);`;
	$: highlightedCase =
		activeCase === null
			? 'Fahren Sie ueber einen Engpass, um den passenden Ansatz zu sehen.'
			: caseStudies[activeCase].title;
	$: flowPercent = Math.round($flowProgress * 100);
	$: dashOffset = 940 - 940 * $flowProgress;

	function trackHero(event: PointerEvent): void {
		const element = event.currentTarget as HTMLElement;
		const bounds = element.getBoundingClientRect();
		heroOffsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 26;
		heroOffsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 26;
	}

	function resetHero(): void {
		heroOffsetX = 0;
		heroOffsetY = 0;
	}

	function magneticCase(node: HTMLElement, index: number) {
		const parent = node.parentElement;
		node.style.transition = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease';

		const onEnter = () => {
			activeCase = index;
			node.style.opacity = '1';
			if (!parent) {
				return;
			}
			for (const sibling of Array.from(parent.children)) {
				if (sibling !== node) {
					(sibling as HTMLElement).style.opacity = '0.45';
				}
			}
		};

		const onMove = (event: MouseEvent) => {
			const rect = node.getBoundingClientRect();
			const x = (event.clientX - rect.left) / rect.width - 0.5;
			const y = (event.clientY - rect.top) / rect.height - 0.5;
			node.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0) scale(1.02)`;
		};

		const onLeave = () => {
			activeCase = null;
			node.style.transform = 'translate3d(0, 0, 0) scale(1)';
			node.style.opacity = '1';
			if (!parent) {
				return;
			}
			for (const sibling of Array.from(parent.children)) {
				(sibling as HTMLElement).style.opacity = '1';
			}
		};

		node.addEventListener('mouseenter', onEnter);
		node.addEventListener('mousemove', onMove);
		node.addEventListener('mouseleave', onLeave);

		return {
			update(nextIndex: number) {
				index = nextIndex;
			},
			destroy() {
				node.removeEventListener('mouseenter', onEnter);
				node.removeEventListener('mousemove', onMove);
				node.removeEventListener('mouseleave', onLeave);
			}
		};
	}

	onMount(() => {
		revealHero = true;

		const runFlow = () => {
			flowProgress.set(0, { duration: 0 });
			requestAnimationFrame(() => {
				flowProgress.set(1, { duration: 2200, easing: cubicInOut });
			});
		};

		runFlow();
		const interval = window.setInterval(runFlow, 3000);

		return () => {
			window.clearInterval(interval);
		};
	});
</script>

<section class="relative isolate overflow-hidden px-6 pb-20 pt-36 sm:px-10 lg:px-14">
	<div
		class="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl"
	></div>

	<div class="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr]">
		<div class="space-y-10">
			{#if revealHero}
				<p
					use:reveal
					class="reveal text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-soft)]"
					style="transition-delay: 60ms;"
				>
					FLUXWERK
				</p>

				<h1
					use:reveal
					class="reveal max-w-3xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
					style="transition-delay: 140ms;"
				>
					KI-Flows für den Mittelstand. Installiert &amp; Integriert.
				</h1>

				<p
					use:reveal
					class="reveal max-w-xl text-base leading-relaxed text-[var(--text-soft)] sm:text-lg"
					style="transition-delay: 220ms;"
				>
					Wir schliessen die Luecke zwischen KI-Potenzial und Praxis: keine Theorieprojekte,
					sondern wartungsarme Automatiken, die wir fest in Ihre bestehende IT einbauen.
				</p>

				<div use:reveal class="reveal flex flex-wrap gap-4" style="transition-delay: 300ms;">
					<a
						href="#services"
						class="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-transform duration-300 hover:scale-[1.02]"
					>
						3-Stufen-Modell ansehen
						<ArrowRight class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
					</a>
					<a
						href="#work"
						class="inline-flex items-center rounded-full border border-[var(--line)] px-6 py-3 text-sm font-medium transition-colors duration-300 hover:bg-[var(--surface-elevated)]"
					>
						Typische Engpässe ansehen
					</a>
				</div>
			{/if}
		</div>

		<div
			use:reveal
			style="transition-delay: 180ms;"
			class="reveal relative min-h-[420px] overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-elevated)]/70 p-6 backdrop-blur-xl lg:p-8"
			on:pointermove={trackHero}
			on:pointerleave={resetHero}
			role="presentation"
		>
			<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,90,43,0.16),transparent_45%)]"></div>
			<div
				class="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]/35 blur-3xl transition-transform duration-500"
				style={heroOrbTransform}
			></div>

			<div class="relative z-10 grid gap-4">
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/70 p-5">
					<p class="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Zeitersparnis pro Team</p>
					<p class="mt-3 text-4xl font-semibold tracking-tight">12h / Woche</p>
				</div>
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/70 p-5">
					<p class="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Integrationsfortschritt</p>
					<p class="mt-3 text-4xl font-semibold tracking-tight">{flowPercent}%</p>
				</div>
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/70 p-5">
					<p class="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">Start bis Go-Live</p>
					<p class="mt-3 text-4xl font-semibold tracking-tight">4 Wochen</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="capabilities" use:reveal class="reveal bg-[var(--surface)] px-6 py-32 transition-colors duration-500">
	<div class="mx-auto w-full max-w-7xl">
		<h2
			use:reveal
			class="reveal mb-4 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl lg:text-5xl"
			style="transition-delay: 90ms;"
		>
			FLUX trifft WERK: modern, aber bodenständig
		</h2>
		<p use:reveal class="reveal max-w-4xl text-base text-[var(--text-soft)] sm:text-lg" style="transition-delay: 150ms;">
			FLUX steht für reibungslosen Datenfluss und Automation. WERK steht für Verlaesslichkeit,
			Handwerk und greifbare Ergebnisse. Genau diese Kombination bauen wir in mittelstaendische Prozesse ein.
		</p>

		<div class="mt-8 grid gap-5 md:grid-cols-2">
			<article use:reveal class="reveal rounded-2xl border border-[var(--line)] bg-[var(--surface-elevated)] p-6" style="transition-delay: 220ms;">
				<h3 class="text-xl font-semibold tracking-tight">FLUX</h3>
				<p class="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
					Schnelle, saubere Stroeme aus Daten, Entscheidungen und Aktionen statt manueller Schleifen.
				</p>
			</article>
			<article use:reveal class="reveal rounded-2xl border border-[var(--line)] bg-[var(--surface-elevated)] p-6" style="transition-delay: 300ms;">
				<h3 class="text-xl font-semibold tracking-tight">WERK</h3>
				<p class="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
					Installiert wie ein Handwerksprojekt: klar geplant, sauber integriert und langfristig wartbar.
				</p>
			</article>
		</div>

		<div use:reveal class="reveal mt-14" style="transition-delay: 360ms;">
			<AIPipeline on:complete={() => (showModal = true)} />
		</div>
	</div>
</section>

<section id="services" class="px-6 pb-24 sm:px-10 lg:px-14">
	<div class="mx-auto max-w-7xl">
		<div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">Das KI-Handwerk in 3 Schritten</h2>
		</div>

		<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each services as service, index}
				<article
					use:reveal={index * 110}
					class="reveal group rounded-2xl border border-[var(--line)] bg-[var(--surface-elevated)] p-6 transition-transform duration-300 hover:-translate-y-1"
				>
					<div class="inline-flex rounded-xl border border-[var(--line)] p-3">
						<svelte:component this={service.icon} class="size-5" />
					</div>
					<h3 class="mt-5 text-xl font-medium tracking-tight">{service.title}</h3>
					<p class="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">{service.details}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section id="work" class="px-6 pb-24 sm:px-10 lg:px-14">
	<div class="mx-auto max-w-7xl">
		<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">Typische Engpässe im Mittelstand</h2>
			<p class="text-sm text-[var(--text-soft)] sm:text-base">{highlightedCase}</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each caseStudies as caseStudy, index}
				<article
					use:magneticCase={index}
					use:reveal
					style={`transition-delay: ${index * 85}ms;`}
					class="reveal rounded-2xl border border-[var(--line)] bg-[var(--surface-elevated)] p-6"
				>
					<div class="mb-10 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
						<span>{caseStudy.industry}</span>
						<span>{caseStudy.year}</span>
					</div>
					<h3 class="text-2xl font-semibold tracking-tight">{caseStudy.title}</h3>
					<p class="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-soft)]">
						{caseStudy.summary}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<ContactModal bind:open={showModal} />

<section id="flow" class="px-6 pb-28 sm:px-10 lg:px-14">
	<div
		class="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-[var(--line)] bg-[var(--surface-elevated)]/70 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10"
	>
		<div>
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">Beispiel-Flow</p>
			<h2 class="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
				Eingehende Kundenmail -> KI-Einordnung -> CRM-Entwurf -> Freigabe
			</h2>
			<p class="mt-4 text-sm text-[var(--text-soft)]">
				Wir verbinden APIs und Systeme wie Outlook, SAP, Salesforce und Datev so, dass Ihr Team nur noch prueft und bestaetigt.
			</p>

			<div class="mt-8 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]/65 p-4 sm:p-6">
				<svg viewBox="0 0 960 220" class="w-full" aria-hidden="true">
					<path
						d="M30 110 H250 C320 110 340 50 410 50 H545 C620 50 620 170 700 170 H930"
						fill="none"
						stroke="var(--muted)"
						stroke-width="12"
						stroke-linecap="round"
					/>
					<path
						d="M30 110 H250 C320 110 340 50 410 50 H545 C620 50 620 170 700 170 H930"
						fill="none"
						stroke="var(--accent)"
						stroke-width="12"
						stroke-linecap="round"
						stroke-dasharray="940"
						stroke-dashoffset={dashOffset}
					/>

					<circle cx="30" cy="110" r="13" fill="var(--surface-elevated)" stroke="var(--accent)" stroke-width="4" />
					<circle cx="410" cy="50" r="13" fill="var(--surface-elevated)" stroke="var(--accent)" stroke-width="4" />
					<circle cx="700" cy="170" r="13" fill="var(--surface-elevated)" stroke="var(--accent)" stroke-width="4" />
					<circle cx="930" cy="170" r="13" fill="var(--surface-elevated)" stroke="var(--accent)" stroke-width="4" />
				</svg>
			</div>
			<p class="mt-4 text-sm text-[var(--text-soft)]">Live-Fortschritt: {flowPercent}%</p>
		</div>

		<div class="flex items-center">
			{#await crmSnapshotPromise}
				<div class="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)]/65 p-6" in:fade={{ duration: 180 }}>
					<p class="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Daten werden synchronisiert</p>
					<div class="mt-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
						<span class="block h-full w-2/3 animate-pulse bg-[var(--accent)]/60"></span>
					</div>
				</div>
			{:then snapshot}
				<div class="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)]/65 p-6" transition:fade={{ duration: 220 }}>
					<p class="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Aktueller Stand</p>
					<h3 class="mt-4 text-2xl font-semibold">{snapshot.pipeline}</h3>
					<div class="mt-6 grid grid-cols-3 gap-3">
						<div class="rounded-xl border border-[var(--line)] p-3">
							<p class="text-xs text-[var(--text-soft)]">Vorgaenge</p>
							<p class="mt-2 text-xl font-semibold">{snapshot.leads}</p>
						</div>
						<div class="rounded-xl border border-[var(--line)] p-3">
							<p class="text-xs text-[var(--text-soft)]">Antwortquote</p>
							<p class="mt-2 text-xl font-semibold">{snapshot.responseRate}</p>
						</div>
						<div class="rounded-xl border border-[var(--line)] p-3">
							<p class="text-xs text-[var(--text-soft)]">Automationen</p>
							<p class="mt-2 text-xl font-semibold">{snapshot.automations}</p>
						</div>
					</div>
				</div>
			{/await}
		</div>
	</div>
</section>

<footer class="px-6 pb-20 sm:px-10 lg:px-14">
	<div class="mx-auto max-w-7xl rounded-3xl border border-[var(--line)] bg-[var(--surface-elevated)]/70 p-8 text-center sm:p-12">
		<img src={fluxwerkLogo} alt="FLUXWERK Logo gross im Footer" class="mx-auto h-28 w-auto object-contain sm:h-36 lg:h-44" />
		<p class="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)]">
			FLUXWERK
		</p>
		<p class="mt-2 text-sm text-[var(--text-soft)]">
			KI-Flows fuer den Mittelstand. Installiert &amp; Integriert.
		</p>
	</div>
</footer>