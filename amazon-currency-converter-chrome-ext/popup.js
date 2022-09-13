chrome.storage.sync.get('state', ({ state }) => {
	if (state === 'On') {
		$('#toggleState').attr('checked', true);
	} else if (state === 'Off') {
		$('#toggleState').attr('checked', false);
	} else {
		$('#toggleState').attr('checked', true);
	}
});

$('#toggleState').click(async () => {
	let [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});

	chrome.scripting.executeScript({
		target: {
			tabId: tab.id,
		},
		function: toggleState,
	});
});

function toggleState() {
	chrome.storage.sync.get('state', ({ state }) => {
		if (state === 'On') {
			chrome.storage.sync.set({ state: 'Off' }, () => {
				$('#toggleState').attr('checked', false);
			});
		} else if (state === 'Off') {
			chrome.storage.sync.set({ state: 'On' }, () => {
				$('#toggleState').attr('checked', true);
			});
		} else {
			chrome.storage.sync.set({ state: 'On' }, () => {
				$('#toggleState').attr('checked', true);
			});
		}
	});
}

chrome.storage.onChanged.addListener(() => {
	chrome.storage.sync.get('state', ({ state }) => {
		chrome.tabs.query(
			{
				active: true,
				currentWindow: true,
			},
			(tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, {
					state: state,
				});
			}
		);
	});
});
