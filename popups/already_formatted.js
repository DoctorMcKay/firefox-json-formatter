document.getElementById('minify').addEventListener('click', function() {
	chrome.runtime.sendMessage({
		type: 'minifyJson'
	});
});
