browser.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "format") {
		try {
			document.body.innerHTML = '<pre>' + JSON.stringify(JSON.parse(document.body.textContent), undefined, "\t") + '</pre>';
		} catch (ex) {
			// whatever
		}
	}
});
