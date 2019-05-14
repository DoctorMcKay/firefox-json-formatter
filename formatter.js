browser.runtime.onMessage.addListener(function(msg, sender, respond) {
	switch (msg.type) {
		case 'format':
			try {
				let pre = document.createElement('pre');
				pre.textContent = JSON.stringify(parseBody(), undefined, "\t");
				let body = document.createElement('body');
				body.appendChild(pre);
				document.body = body;
			} catch (ex) {
				// whatever
			}
			break;

		case 'checkJson':
			// Check if this page appears to be valid JSON
			let parsed = parseBody();
			respond(parsed !== null && typeof parsed == 'object');
			break;
	}
});

function parseBody() {
	try {
		return JSON.parse(document.body.textContent);
	} catch (ex) {
		return null;
	}
}
