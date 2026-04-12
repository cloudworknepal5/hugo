/**
 * Name: postpagetemplate3.js
 * Version: 3.2
 * Features: Nepali Date, Reading Time, Font Resizer, Auto-Share Load (ShareThis)
 */

(function() {
    "use strict";

    // १. ShareThis Script Injector
    const injectShareThis = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://platform-api.sharethis.com/js/sharethis.js#property=692ec01d4ee3278e2af23397&product=inline-share-buttons';
        script.async = true;
        document.head.appendChild(script);
    };

    const config = {
        location: "काठमाडौँ",
        yearBS: "२०८२",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        monthMap: {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        },
        currentFontSize: 20
    };

    const toNepaliNum = (num) => num.toString().split('').map(char => config.numMap[char] || char).join('');

    // २. कोरि फङ्सनहरू (Date & Reading Time)
    const runCoreFunctions = () => {
        // Nepali Date Converter
        document.querySelectorAll('.location-date').forEach(el => {
            let rawText = el.innerText;
            if (/[a-zA-Z]/.test(rawText)) {
                let engDayMatch = rawText.match(/\d+/);
                if (engDayMatch) {
                    let engDay = parseInt(engDayMatch[0]);
                    let calculatedDay = 24 + (engDay - 8); // Jan 8 -> Poush 24 logic
                    let nepMonth = "";
                    Object.keys(config.monthMap).forEach(m => { if (rawText.includes(m)) nepMonth = config.monthMap[m]; });
                    el.innerHTML = `${config.location} | ${nepMonth} ${toNepaliNum(calculatedDay)}, ${config.yearBS}`;
                }
            }
        });

        // Auto Reading Time
        const postBody = document.querySelector('.post-body, .rp-body-style');
        const timeDisplay = document.querySelector('#rt-display');
        if (postBody && timeDisplay) {
            const words = postBody.innerText.trim().split(/\s+/).length;
            const minutes = Math.ceil(words / 150);
            timeDisplay.innerText = `⏱️ ${toNepaliNum(minutes)} मिनेट पढ्न लाग्ने`;
        }
    };

    // ३. Multi-function: Font Resizer
    window.changeFontSize = (action) => {
        const content = document.querySelector('.post-body, .rp-body-style');
        if (!content) return;
        if (action === 'increase' && config.currentFontSize < 32) config.currentFontSize += 2;
        if (action === 'decrease' && config.currentFontSize > 14) config.currentFontSize -= 2;
        content.style.fontSize = config.currentFontSize + 'px';
    };

    // ४. Initialize All
    const init = () => {
        injectShareThis();
        runCoreFunctions();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
