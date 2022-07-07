// Content scripts are automatically run on document_end, so we can check immediately whether the current page is JSON.
let checkParsed = parseBody();
chrome.runtime.sendMessage({
	type: 'contentScriptCheckedJson',
	value: checkParsed !== null && typeof checkParsed == 'object'
});

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
	switch (msg.type) {
		case 'format':
			try {
				let pre = document.createElement('pre');
				pre.textContent = JSON.stringify(parseBody(), undefined, msg.indent_style || "\t");
				let body = document.createElement('body');
				body.appendChild(pre);
				document.body = body;
			} catch (ex) {
				// whatever
			}
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
