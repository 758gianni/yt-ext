let state = 'On';

chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.sync.set({
		state,
	});
});
