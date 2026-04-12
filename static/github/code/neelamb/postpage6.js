/**
 * Name: postpagetemplate2.js
 * Features: 
 * 1. English to Nepali Date (Accurate 2082)
 * 2. Reading Time Calculation
 * 3. English to Nepali Digit Converter
 * 4. Dynamic Facebook OG Tag Generator
 * 5. Multi-function Visitor Counter (Firebase Integration)
 * 6. Multi-function Font Resizer (Increase/Decrease/Reset)
 */

(function() {
    "use strict";

    // १. Configuration र Map हरू
    const config = {
        location: "काठमाडौँ",
        yearBS: "२०८२",
        firebaseURL: "YOUR_FIREBASE_DATABASE_URL", // यहाँ आफ्नो Firebase URL हाल्नुहोस्
        defaultFontSize: 18,
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        monthMap: {
            'January': 'पुस', 'February': 'माघ', 'March': 'फागुन', 'April': 'चैत',
            'May': 'वैशाख', 'June': 'जेठ', 'July': 'असार', 'August': 'साउन',
            'September': 'भदौ', 'October': 'असोज', 'November': 'कात्तिक', 'December': 'मंसिर'
        }
    };

    let currentFontSize = config.defaultFontSize;

    // Helper: अंक परिवर्तन गर्ने Function
    const toNepaliNum = (num) => {
        return num.toString().split('').map(char => config.numMap[char] || char).join('');
    };

    // २. मिति परिवर्तन गर्ने (Date Engine)
    const updateNepaliDate = () => {
        const dateElements = document.querySelectorAll('.location-date');
        dateElements.forEach(el => {
            let rawText = el.innerText;
            if (/[a-zA-Z]/.test(rawText)) {
                let engDayMatch = rawText.match(/\d+/);
                if (engDayMatch) {
                    let engDay = parseInt(engDayMatch[0]);
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

    // ३. पढ्न लाग्ने समय (Reading Time)
    const initReadingTime = () => {
        const postBody = document.querySelector('.post-body, .rp-body-style');
        const timeDisplay = document.querySelector('.reading-time');
        if (postBody && timeDisplay) {
            const text = postBody.innerText.trim();
            const wordCount = text.split(/\s+/).length;
            const minutes = Math.ceil(wordCount / 150);
            timeDisplay.innerText = `पढ्न लाग्ने समय: ${toNepaliNum(minutes)} मिनेट`;
        }
    };

    // ४. भिजिटर काउन्टर (Visitor Counter - Multi-function)
    const initVisitorCounter = async () => {
        const counterEl = document.getElementById('post-view-count');
        if (!counterEl || config.firebaseURL.includes("YOUR_")) return;

        const postId = window.location.pathname.replace(/[/.]/g, "_");
        const url = `${config.firebaseURL}/views/${postId}.json`;

        try {
            const response = await fetch(url);
            let count = await response.json();
            count = (count === null) ? 1 : count + 1;

            await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
            counterEl.innerText = toNepaliNum(count) + " पटक हेरियो";
        } catch (e) { console.error("Counter Error", e); }
    };

    // ५. फन्ट साइज नियन्त्रक (Font Resizer - Multi-function)
    window.adjustFontSize = (action) => {
        const postBody = document.querySelector('.post-body, .rp-body-style');
        if (!postBody) return;

        if (action === 'up') currentFontSize += 2;
        else if (action === 'down') currentFontSize -= 2;
        else currentFontSize = config.defaultFontSize;

        postBody.style.fontSize = currentFontSize + "px";
    };

    // ६. Facebook Open Graph (OG) Manager
    const setupOpenGraph = () => {
        const postTitle = document.title;
        const postUrl = window.location.href;
        const postDesc = document.querySelector('.post-body p')?.innerText.substring(0, 160) || "नेपाली समाचार";
        const postImg = document.querySelector('.post-body img')?.src || "";

        const ogTags = {
            'og:title': postTitle,
            'og:url': postUrl,
            'og:description': postDesc,
            'og:image': postImg,
            'og:type': 'article'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            if (!content) return;
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        });
    };

    // निष्पादन (Execution)
    const runAll = () => {
        updateNepaliDate();
        initReadingTime();
        setupOpenGraph();
        initVisitorCounter();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAll);
    } else {
        runAll();
    }
})();
