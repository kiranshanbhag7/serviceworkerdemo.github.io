if ('serviceWorker' in navigator) {
	// Register Service Worker on load event of page
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('../sw_config.js')
			.then(reg => console.log('Service Worker: Registered'))
			.catch(err => console.log(`Service Worker: Error: ${err}`));
	});
}