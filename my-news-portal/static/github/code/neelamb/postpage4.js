/**
 * Blogger Toolbox v14.5 - Ultra Responsive Edition
 * Features: 1. Nepali Date | 2. View Counter | 3. Smart Sticky Headline
 */

const BloggerToolbox = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January': { m: 'माघ', offset: 56, start: 15, prevDays: 16 },
            'February': { m: 'फागुन', offset: 56, start: 13, prevDays: 17 },
            'March': { m: 'चैत', offset: 56, start: 15, prevDays: 14 },
            'April': { m: 'वैशाख', offset: 57, start: 14, prevDays: 17 },
            'May': { m: 'जेठ', offset: 57, start: 15, prevDays: 17 },
            'June': { m: 'असार', offset: 57, start: 15, prevDays: 16 },
            'July': { m: 'साउन', offset: 57, start: 17, prevDays: 16 },
            'August': { m: 'भदौ', offset: 57, start: 17, prevDays: 16 },
            'September': { m: 'असोज', offset: 57, start: 17, prevDays: 15 },
            'October': { m: 'कात्तिक', offset: 57, start: 18, prevDays: 14 },
            'November': { m: 'मंसिर', offset: 57, start: 17, prevDays: 14 },
            'December': { m: 'पुस', offset: 57, start: 16, prevDays: 15 }
        }
    },

    toNep: function(n) {
        return n.toString().split('').map(c => this.config.numMap[c] || c).join('');
    },

    initCounter: async function() {
        const el = document.getElementById("visitor-count");
        if (!el) return;
        const pId = window.location.pathname.replace(/[\/\.#\$\[\]]/g, "_") || "home";
        try {
            const url = `${this.config.databaseURL}/views/${pId}.json`;
            let res = await fetch(url);
            let count = await res.json() || 0;
            if (!sessionStorage.getItem("v_" + pId)) {
                count++;
                await fetch(url, { method: 'PUT', body: JSON.stringify(count) });
                sessionStorage.setItem("v_" + pId, "true");
            }
            const eyeIcon = `<svg style="width:16px;height:16px;margin-right:5px;fill:#ce1212;vertical-align:middle;" viewBox="0 0 576 512"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
            el.innerHTML = `${eyeIcon} <span style="color:#ce1212;font-weight:bold;">${this.toNep(count)}</span>`;
        } catch (e) { console.warn("Counter failed."); }
    },

    initDateTool: function() {
        const el = document.querySelector(".location-date");
        if (!el) return;
        const match = el.innerText.trim().match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
        if (match) {
            const [_, eM, eD, eY] = match;
            const data = this.config.monthData[eM];
            const dInt = parseInt(eD), yInt = parseInt(eY);
            let bsDay, bsMonth = data.m;
            if (dInt >= data.start) { bsDay = (dInt - data.start) + 1; }
            else {
                const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
                let idx = months.indexOf(data.m);
                bsMonth = idx === 0 ? months[11] : months[idx - 1];
                bsDay = data.prevDays + dInt;
            }
            const bsYear = (eM === 'April' && dInt < 14) ? yInt + 56 : yInt + data.offset;
            const dayName = this.config.weekdays[new Date(`${eM} ${eD}, ${eY}`).getDay()];
            el.innerText = `${dayName}, ${bsMonth} ${this.toNep(bsDay)}, ${this.toNep(bsYear)}`;
        }
    },

    // सुधारेको फङ्सन ३: Intersection Observer लजिक (सबैभन्दा भरपर्दो)
    initStickyHeadline: function() {
        const header = document.getElementById("stickyHeadline");
        const contentField = document.getElementById("headlineContent");
        const mainTitle = document.querySelector(".post-title.entry-title") || document.querySelector("h1.post-title");
        const postBody = document.querySelector(".post-body");

        if (!header || !contentField || !mainTitle || !postBody) return;

        contentField.innerText = mainTitle.innerText.trim();

        // नयाँ लजिक: जब मुख्य टाइटल स्क्रिनबाट हराउँछ, तब मात्र स्टिकी देखाउने
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && window.scrollY > entry.boundingClientRect.top) {
                    header.classList.add("visible");
                } else {
                    header.classList.remove("visible");
                }
            });
        }, { threshold: 0 });

        observer.observe(mainTitle);
    },

    init: function() {
        this.initCounter();
        this.initDateTool();
        this.initStickyHeadline();
    }
};

// तत्काल रन गर्ने
BloggerToolbox.init();
