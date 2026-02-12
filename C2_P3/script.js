function performSearch() {
	const inputText = document.getElementById('inputText').value;
	const searchText = document.getElementById('searchText').value;
	const resultText = document.getElementById('outputText');

	if (!searchText) {
		resultText.value = 'Enter a search term';
		return;
	}

	try {
		const re = new RegExp(searchText, 'g');
		const matches = inputText.match(re);
		resultText.value = matches ? matches.join('\n') : 'No matches found';
	} catch (error) {
		resultText.value = 'Invalid regular expression';
	}
}

function performReplace() {
	const inputText = document.getElementById('inputText').value;
	const searchText = document.getElementById('searchText').value;
	const replaceText = document.getElementById('replaceText').value;
	const resultText = document.getElementById('outputText');

	if (!searchText) {
		resultText.value = 'Enter a search term';
		return;
	}

	try {
		const re = new RegExp(searchText, 'g');
		resultText.value = inputText.replace(re, replaceText);
	} catch (error) {
		resultText.value = 'Invalid regular expression';
	}
}

function performFormat() {
	const inputText = document.getElementById('inputText').value;
	const resultText = document.getElementById('outputText');
	resultText.value = inputText.replace(/\b\w/g, (ch) => ch.toUpperCase());
}