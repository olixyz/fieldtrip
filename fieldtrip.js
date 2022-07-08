"use strict";
(function () {
    /* 
    * Load above closing </body> tag
    */
    const ftHandleClicks = (e) => {
        e.stopProagation();
        e.preventDefault();
        if (!e.target.id.startsWith('ft__')) {
            return;
        }
        window.parent.postMessage({ id: e.target.id }, '*');
    }

    function ftSendAllClickables() {
        const ftAll = document.querySelectorAll('[id^="ft__"]');
        //obj = JSON.parse(JSON.stringify(ftAll));
        const clickables = [];
        for (let node of ftAll) {
            clickables.push(node.id)
        }

        window.parent.postMessage({ all: clickables }, '*');
    }

    const ftHandleMessages = (e) => {
        const ftAll = document.querySelectorAll('[id^="ft__"]');
        const popoverNodes = document.querySelectorAll('[id^="foo__ft__"]');
        switch (e.data.type) {
            case 'highlight':
                for (let ele of popoverNodes) {
                    ele.remove()
                }
                // Add styles to highlight anchors
                if (e.data.data.highlight) {
                    // Add popper tooltip
                    const popoverStyle = "position:relative;display:inline";
                    const tooltipStyle = "position:absolute;padding:.5rem;bottom:0;left:0;z-index:100;background-color: rgba(255, 255, 255, .9);font-family: sans-serif;font-size: 1rem;font-weight: normal;font-style: normal;color: rgb(0, 0, 0);filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06));";
                    for (let ele of ftAll) {

                        ele.classList.add('ft__highlight');
                        const popover = document.createElement('div');
                        const tooltip = document.createElement('div');
                        popover.id = `foo__${ele.id}`;
                        popover.style.cssText = popoverStyle;
                        tooltip.style.cssText = tooltipStyle;
                        tooltip.innerText = ele.id;
                        popover.appendChild(tooltip);
                        ele.appendChild(popover);

                    }

                } else {
                    for (let ele of popoverNodes) {
                        ele.remove()
                    }
                    for (let ele of ftAll) {
                        ele.classList.remove('ft__highlight')
                    }
                }
                break;
            default:
                console.log('No Handler for message type');
        }

        // add class
        // e.data.removeHighlight
        // Highlight All
    }

    document.body.addEventListener('click', ftHandleClicks, false);
    window.addEventListener('message', ftHandleMessages, false);
    ftSendAllClickables();

    window.onunload = function () {
        document.body.removeEventListener('click', ftHandleClicks);
        window.removeEventListener('message', ftHandleMessages);
        return;
    }

}());