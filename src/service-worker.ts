/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { build, files, prerendered, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

const precache_list = [...build, ...files, ...prerendered].map((s) => ({
    url: s,
	revision: version
}));
precacheAndRoute(precache_list);
cleanupOutdatedCaches();

const navigationHandler = new NetworkFirst({
	cacheName: 'pages-cache',
	networkTimeoutSeconds: 3,
	plugins: [
		new CacheableResponsePlugin({ statuses: [0, 200] }),
		new ExpirationPlugin({ maxEntries: 50 }),
	],
});

const navigationRoute = new NavigationRoute(navigationHandler);
registerRoute(navigationRoute);

registerRoute(
	({ request }) => request.destination === 'image',
	new CacheFirst({
		cacheName: 'images-cache',
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			new ExpirationPlugin({
				maxEntries: 100,
				maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
			}),
		],
	})
);

registerRoute(
	({ request }) => request.destination === 'font',
	new CacheFirst({
		cacheName: 'fonts-cache',
		plugins: [
			new CacheableResponsePlugin({ statuses: [0, 200] }),
			new ExpirationPlugin({
				maxEntries: 30,
				maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
			}),
		],
	})
);

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
