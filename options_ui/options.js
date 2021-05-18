// This is run in a defer tag so the page is loaded when this runs

chrome.storage.sync.get('indent_style', (vals) => {
	if (vals.indent_style) {
		document.getElementById('indent-style').value = vals.indent_style == "\t" ? 'tab' : vals.indent_style;
	}
});

document.getElementById('indent-style').addEventListener('change', function() {
	chrome.storage.sync.set({
		"indent_style": this.value == "tab" ? "\t" : parseInt(this.value, 10)
	});
});
