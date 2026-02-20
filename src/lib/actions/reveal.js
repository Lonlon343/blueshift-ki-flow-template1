/**
 * @param {HTMLElement} node
 * @param {number} [delay=0]
 */
export function reveal(node, delay = 0) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						node.classList.add('is-visible');
					}, delay);
					observer.unobserve(node);
				}
			});
		},
		{ threshold: 0.1 }
	);

	node.classList.add('reveal');
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
