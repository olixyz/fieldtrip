"use strict";
(function () {
	const ftHandleClicks = (e) => {
		e.stopPropagation();
		e.preventDefault();
		if (!e.target.id.startsWith('ft__')) {
			return;
		}
		// This seems to trigger the message eventListener, which should not listen
		// to this browsing context
		window.parent.postMessage({ id: e.target.id }, '*');
		console.info('posting message ', e.target.id);
	};

	function ftSendAllClickables() {
		const ftAll = document.querySelectorAll('[id^="ft__"]');
		//obj = JSON.parse(JSON.stringify(ftAll));
		const clickables = [];
		for (let node of ftAll) {
			clickables.push(node.id);
		}

		window.parent.postMessage({ all: clickables }, '*');
	}

	const ftHandleMessages = (e) => {
		const ftAll = document.querySelectorAll('[id^="ft__"]');
		const popoverNodes = document.querySelectorAll('[id^="popover__ft__"]');
		const tooltipNodes = document.querySelectorAll('[id^="tooltip__ft__"]');
		switch (e.data?.type) {
			case 'highlight':
				for (let ele of popoverNodes) {
					ele.remove();
				}
				// Add styles to highlight anchors
				if (e.data?.highlight) {
					// Add popper tooltip
					for (let ele of ftAll) {
						ele.classList.add('ft__highlight');
						const popover = document.createElement('div');
						const tooltip = document.createElement('div');
						popover.id = `popover__${ele.id}`;
						tooltip.id = `tooltip__${ele.id}`;
						popover.classList.add('ft__popover');
						tooltip.innerText = ele.id;
						tooltip.classList.add('ft__popoverTooltip');
						popover.appendChild(tooltip);
						ele.appendChild(popover);
					}
				} else {
					for (let ele of popoverNodes) {
						ele.remove();
					}
					for (let ele of ftAll) {
						ele.classList.remove('ft__highlight');
					}
				}
				break;
			case 'scrollTo':
				const element = document.getElementById(e.data.anchorName);
				if (!element) {
					console.info("Element not found")
					break;
				}
				const elTooltip = document.getElementById(`tooltip__${element.id}`);
				element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
				for (let ele of ftAll) {
					ele.classList.remove('ft__scrollTo');
				}
				for (let ele of tooltipNodes) {
					ele.classList.remove('ft__tooltip__highlight');
				}

				element.classList.add('ft__scrollTo');
				elTooltip.classList.add('ft__tooltip__highlight');
				break;

			default:
				console.log('No Handler for message type');
		}

		// add class
		// e.data.removeHighlight
		// Highlight All
	};

	document.body.addEventListener('click', ftHandleClicks, false);
	window.addEventListener('message', ftHandleMessages, false);
	ftSendAllClickables();

	window.onunload = function () {
		document.body.removeEventListener('click', ftHandleClicks);
		window.removeEventListener('message', ftHandleMessages);
		return;
	};

}());