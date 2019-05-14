const DEBUG = false; // controls logging

browser.webRequest.onCompleted.addListener(function(req) {
	let prefix = `[TAB ${req.tabId}]`;
	log(prefix + ` Frame ${req.frameId}, type ${req.type}`);
	if (req.frameId != 0 || !req.responseHeaders || req.type != "main_frame") {
		log(prefix + ' Ignoring');
		return;
	}

	let isJson = false;
	req.responseHeaders.forEach(function(header) {
		log(prefix + ` ${header.name} = ${header.value}`);
		if (header.name.toLowerCase() == "content-type" && header.value.split(';')[0].trim().toLowerCase() == "application/json") {
			isJson = true;
		}
	});

	log(prefix + ' Is JSON: ' + (isJson ? 'true' : 'false'));
	setTimeout(() => {
		if (isJson) {
			browser.pageAction.show(req.tabId);
		} else {
			browser.pageAction.hide(req.tabId);
			browser.tabs.sendMessage(req.tabId, {"type": "checkJson", "tabId": req.tabId}).then((isJson) => {
				log(prefix + ' Got response to checkJson: ' + isJson);
				if (isJson) {
					browser.pageAction.show(req.tabId);
				}
			});
		}
	}, 100);
}, {"urls": ["<all_urls>"]}, ["responseHeaders"]);

browser.pageAction.onClicked.addListener(function(tab) {
	browser.tabs.sendMessage(tab.id, {"type": "format"});
	browser.pageAction.hide(tab.id);
});

function log(msg) {
	if (DEBUG) {
		console.log(msg);
	}
}
