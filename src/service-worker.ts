/// <reference types="@sveltejs/kit" />
import { build, files, prerendered, version } from '$service-worker';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

const precache_list = [...build, ...files, ...prerendered].map((s) => ({
    url: s,
	revision: version
}));
precacheAndRoute(precache_list);
cleanupOutdatedCaches();

const pageStrategy = new CacheFirst({
	cacheName: 'images-cache',
	plugins: [
		new CacheableResponsePlugin({
			statuses: [0, 200],
		}),
	],
});

registerRoute(
	({ request }) => request.mode === 'navigate',
	pageStrategy
);

const navigationHandler = new NetworkFirst({
		cacheName: 'navigations-cache',
	networkTimeoutSeconds: 3,
});

const navigationRoute = new NavigationRoute(navigationHandler, {});

registerRoute(navigationRoute);