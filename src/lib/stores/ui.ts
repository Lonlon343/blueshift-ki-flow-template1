import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

const canUseDOM = typeof window !== 'undefined';

export const menuOpen = writable(false);
export const theme = writable(false);

function getStoredTheme(): Theme | null {
	if (!canUseDOM) {
		return null;
	}

	const value = window.localStorage.getItem('theme');
	return value === 'light' || value === 'dark' ? value : null;
}

function getSystemTheme(): Theme {
	if (!canUseDOM) {
		return 'light';
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(isDark: boolean): void {
	if (!canUseDOM) {
		return;
	}

	const resolvedTheme: Theme = isDark ? 'dark' : 'light';
	const root = document.documentElement;
	root.classList.toggle('dark', isDark);
	root.dataset.theme = resolvedTheme;
	root.style.colorScheme = resolvedTheme;
	window.localStorage.setItem('theme', resolvedTheme);
}

export function bootstrapTheme(): void {
	const resolvedTheme = getStoredTheme() ?? getSystemTheme();
	const isDark = resolvedTheme === 'dark';
	theme.set(isDark);
	applyTheme(isDark);
}

export function toggleTheme(): void {
	theme.update((value) => !value);
}
