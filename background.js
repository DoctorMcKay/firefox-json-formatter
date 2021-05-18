const DEBUG = true; // controls logging

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {
	respond(); // we don't need to send a response, so just do it now
	
	if (!msg || !msg.type || msg.type !== 'contentScriptCheckedJson' || !sender || !sender.tab || !sender.tab.id) {
		log('Ignoring message');
		return;
	}
	
	setActionStatus(sender.tab.id, msg.value);
});

chrome.action.onClicked.addListener(function(tab) {
	chrome.storage.sync.get('indent_style', (vals) => {
		chrome.tabs.sendMessage(tab.id, {"type": "format", "indent_style": vals.indent_style});
		setActionStatus(tab.id, false);
		chrome.action.setPopup({tabId: tab.id, popup: 'popups/already_formatted.html'});
	});
});

function setActionStatus(tabId, enabled) {
	log('Setting page action for tab ' + tabId + ' to ' + enabled);
	
	chrome.action.setPopup({tabId, popup: enabled ? '' : 'popups/no_json.html'});
	
	chrome.action.setBadgeBackgroundColor({tabId, color: '#f00'});
	chrome.action.setBadgeText({tabId, text: enabled ? 'JSON' : ''});
}

function log(msg) {
	if (DEBUG) {
		console.log(msg);
	}
}
