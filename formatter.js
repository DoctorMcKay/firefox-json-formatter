browser.runtime.onMessage.addListener(function(msg) {
	if (msg.type == "format") {
		try {
			var pre = document.createElement('pre');
			pre.textContent = JSON.stringify(JSON.parse(document.body.textContent), undefined, "\t");
			var body = document.createElement('body');
			body.appendChild(pre);
			document.body = body;
		} catch (ex) {
			// whatever
		}
	}
});
