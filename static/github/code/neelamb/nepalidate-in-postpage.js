/**
 * Name: nepalidate-in-postpage.js
 * Version: 8.3 (Correction Only)
 * Target: Feb 6, 2026 = Magh 23, 2082
 */

(function() {
    "use strict";

    const config = {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January':   { m: 'माघ', offset: 56, start: 15, prevDays: 16 }, 
            'February':  { m: 'फागुन', offset: 56, start: 13, prevDays: 17 },
            'March':     { m: 'चैत', offset: 56, start: 15, prevDays: 14 },
            'April':     { m: 'वैशाख', offset: 57, start: 14, prevDays: 17 },
            'May':       { m: 'जेठ', offset: 57, start: 15, prevDays: 17 },
            'June':      { m: 'असार', offset: 57, start: 15, prevDays: 16 },
            'July':      { m: 'साउन', offset: 57, start: 17, prevDays: 16 },
            'August':    { m: 'भदौ', offset: 57, start: 17, prevDays: 16 },
            'September': { m: 'असोज', offset: 57, start: 17, prevDays: 15 },
            'October':   { m: 'कात्तिक', offset: 57, start: 18, prevDays: 14 },
            'November':  { m: 'मंसिर', offset: 57, start: 17, prevDays: 14 },
            'December':  { m: 'पुस', offset: 57, start: 16, prevDays: 15 }
        }
    };

    /** Function 1: Convert Numbers */
    const toNepNum = (n) => n.toString().split('').map(c => config.numMap[c] || c).join('');

    /** Function 2: Get Weekday Name */
    const getNepWeekday = (year, month, day) => {
        const d = new Date(`${month} ${day}, ${year}`);
        return config.weekdays[d.getDay()];
    };

    /** Function 3: Calculate BS Year */
    const getBSYear = (engYear, engMonth, engDay, baseOffset) => {
        if (engMonth === 'April' && engDay < 14) return engYear + 56;
        return engYear + baseOffset;
    };

    /** Function 4: Calculate BS Day and Month (Corrected Calculation) */
    const getBSDateDetails = (engDay, engMonth) => {
        const data = config.monthData[engMonth];
        let bsDay, bsMonth = data.m;

        if (engDay >= data.start) {
            bsDay = (engDay - data.start) + 1;
        } else {
            const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
            let idx = months.indexOf(data.m);
            bsMonth = idx === 0 ? months[11] : months[idx - 1];
            // Correction applied here
            bsDay = data.prevDays + engDay; 
        }
        return { bsDay, bsMonth };
    };

    /** Function 5: UI Renderer */
    const renderNepaliDate = () => {
        document.querySelectorAll('.location-date').forEach(el => {
            const match = el.innerText.match(/([a-zA-Z]+)\s(\d+),\s(\d+)/);
            if (match) {
                const [_, eMonth, eDay, eYear] = match;
                const dInt = parseInt(eDay);
                const yInt = parseInt(eYear);

                const { bsDay, bsMonth } = getBSDateDetails(dInt, eMonth);
                const bsYear = getBSYear(yInt, eMonth, dInt, config.monthData[eMonth].offset);
                const weekday = getNepWeekday(yInt, eMonth, dInt);

                el.innerHTML = `${weekday}, ${bsMonth} ${toNepNum(bsDay)}, ${toNepNum(bsYear)}`;
            }
        });
    };

    // Initialize
    window.addEventListener('load', renderNepaliDate);
    setTimeout(renderNepaliDate, 1500);
})();
