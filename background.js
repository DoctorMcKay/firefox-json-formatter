const DEBUG = true; // controls logging

chrome.runtime.onMessage.addListener(async function(msg, sender, respond) {
	respond(); // we don't need to send a response, so just do it now

	if (!msg || !msg.type) {
		log('Ignoring message');
		return;
	}

	switch (msg.type) {
		case 'contentScriptCheckedJson':
			if (!sender || !sender.tab || !sender.tab.id) {
				log('Ignoring contentScriptCheckedJson because no sender tab id');
				break;
			}

			setActionStatus(sender.tab.id, msg.value);
			break;

		case 'minifyJson':
			// Send minify message to active tab
			let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
			chrome.tabs.sendMessage(tab.id, {type: 'minify'});
			setActionStatus(tab.id, true);
			break;

		default:
			log(`Ignoring message ${msg.type}`);
	}
});

chrome.action.onClicked.addListener(async function(tab) {
	let {indent_style} = await chrome.storage.sync.get('indent_style');
	chrome.tabs.sendMessage(tab.id, {type: 'format', indent_style});
	setActionStatus(tab.id, false);
	chrome.action.setPopup({tabId: tab.id, popup: 'popups/already_formatted.html'});
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
