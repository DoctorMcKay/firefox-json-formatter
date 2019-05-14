// This is run in a defer tag so the page is loaded when this runs

browser.storage.sync.get('indent_style').then((vals) => {
	if (vals.indent_style) {
		document.getElementById('indent-style').value = vals.indent_style == "\t" ? 'tab' : vals.indent_style;
	}
});

document.getElementById('indent-style').addEventListener('change', function() {
	browser.storage.sync.set({
		"indent_style": this.value == "tab" ? "\t" : parseInt(this.value, 10)
	});
});
