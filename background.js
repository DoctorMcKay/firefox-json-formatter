browser.webRequest.onCompleted.addListener(function(req) {
	console.log(req.frameId + " frame, type " + req.type + ", tabid " + req.tabId);
	if (req.frameId != 0 || !req.responseHeaders || req.type != "main_frame") {
		return;
	}

	let isJson = false;
	req.responseHeaders.forEach(function(header) {
		if (header.name.toLowerCase() == "content-type" && header.value.split(';')[0].trim().toLowerCase() == "application/json") {
			isJson = true;
		}
	});

	if (isJson) {
		browser.pageAction.show(req.tabId);
	} else {
		browser.pageAction.hide(req.tabId);
	}
}, {"urls": ["<all_urls>"]}, ["responseHeaders"]);

browser.pageAction.onClicked.addListener(function(tab) {
	browser.tabs.sendMessage(tab.id, {"type": "format"});
	browser.pageAction.hide(tab.id);
});
