/**
 * Name: postpagetemplate2.js
 * Features: 
 * 1. English to Nepali Date (Accurate 2082 Poush 24)
 * 2. Reading Time Calculation (Word Counter)
 * 3. English to Nepali Digit Converter
 */

(function() {
    "use strict";

    // configuration र Map हरू
    const config = {
        location: "काठमाडौँ",
        yearBS: "२०८२",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        monthMap: {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        }
    };

    // अंक परिवर्तन गर्ने Function
    const toNepaliNum = (num) => {
        return num.toString().split('').map(char => config.numMap[char] || char).join('');
    };

    // १. मिति परिवर्तन गर्ने मुख्य फङ्सन (Date Engine)
    const updateNepaliDate = () => {
        const dateElements = document.querySelectorAll('.location-date');
        dateElements.forEach(el => {
            let rawText = el.innerText;

            if (/[a-zA-Z]/.test(rawText)) {
                let engDayMatch = rawText.match(/\d+/);
                if (engDayMatch) {
                    let engDay = parseInt(engDayMatch[0]);
                    
                    // Logic: Jan 08, 2026 = Poush 24, 2082
                    let baseEngDay = 8;
                    let baseNepDay = 24;
                    let calculatedDay = baseNepDay + (engDay - baseEngDay);
                    let finalNepDay = toNepaliNum(calculatedDay);
                    
                    let nepMonth = "";
                    Object.keys(config.monthMap).forEach(m => {
                        if (rawText.includes(m)) nepMonth = config.monthMap[m];
                    });

                    el.innerHTML = `${config.location} | ${nepMonth} ${finalNepDay}, ${config.yearBS}`;
                }
            }
        });
    };

    // २. पढ्न लाग्ने समय गणना गर्ने फङ्सन (Reading Time)
    const initReadingTime = () => {
        const postBody = document.querySelector('.post-body, .rp-body-style'); // दुबै क्लास चेक गर्ने
        const timeDisplay = document.querySelector('.reading-time');

        if (postBody && timeDisplay) {
            const text = postBody.innerText.trim();
            const wordCount = text.split(/\s+/).length;
            const wordsPerMinute = 150; // औसत नेपाली पढ्ने गति
            const minutes = Math.ceil(wordCount / wordsPerMinute);
            
            timeDisplay.innerText = `पढ्न लाग्ने समय: ${toNepaliNum(minutes)} मिनेट`;
        }
    };

    // सबै कार्यहरू एकैसाथ सुरु गर्ने (Execution)
    const runAll = () => {
        updateNepaliDate();
        initReadingTime();
    };

    // पेज लोडका विभिन्न चरणमा रन गर्ने (Safety)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAll);
    } else {
        runAll();
    }
    window.addEventListener('load', runAll);
    setTimeout(runAll, 2000); // ढिलो लोड हुने एलिमेन्टको लागि

})();
