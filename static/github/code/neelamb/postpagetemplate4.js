/**
 * Name: nepalidate-in-postpage.js
 * Version: 8.0 (Precision + Weekdays)
 * Feature: Multi-function logic with Weekday support for 2082/2026
 */

(function() {
    "use strict";

    const config = {
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
        weekdays: ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'],
        monthData: {
            'January':   { m: 'माघ', offset: 56, start: 15 }, 
            'February':  { m: 'फागुन', offset: 56, start: 13 },
            'March':     { m: 'चैत', offset: 56, start: 15 },
            'April':     { m: 'वैशाख', offset: 57, start: 14 },
            'May':       { m: 'जेठ', offset: 57, start: 15 },
            'June':      { m: 'असार', offset: 57, start: 15 },
            'July':      { m: 'साउन', offset: 57, start: 17 },
            'August':    { m: 'भदौ', offset: 57, start: 17 },
            'September': { m: 'असोज', offset: 57, start: 17 },
            'October':   { m: 'कात्तिक', offset: 57, start: 18 },
            'November':  { m: 'मंसिर', offset: 57, start: 17 },
            'December':  { m: 'पुस', offset: 57, start: 16 }
        }
    };

    /** Function 1: Convert Numbers */
    const toNepNum = (n) => n.toString().split('').map(c => config.numMap[c] || c).join('');

    /** Function 2: Get Weekday Name */
    const getNepWeekday = (year, month, day) => {
        // month index in JS Date is 0-11
        const monthIndex = new Date(`${month} ${day}, ${year}`).getMonth();
        const dayOfWeek = new Date(year, monthIndex, day).getDay();
        return config.weekdays[dayOfWeek];
    };

    /** Function 3: Calculate BS Year */
    const getBSYear = (engYear, engMonth, engDay, baseOffset) => {
        if (engMonth === 'April' && engDay < 14) return engYear + 56;
        return engYear + baseOffset;
    };

    /** Function 4: Calculate BS Day and Month */
    const getBSDateDetails = (engDay, engMonth) => {
        const data = config.monthData[engMonth];
        let bsDay, bsMonth = data.m;

        if (engDay >= data.start) {
            bsDay = (engDay - data.start) + 1;
        } else {
            // Roll back to previous Nepali month
            const months = ['पुस','माघ','फागुन','चैत','वैशाख','जेठ','असार','साउन','भदौ','असोज','कात्तिक','मंसिर'];
            let idx = months.indexOf(data.m);
            bsMonth = idx === 0 ? months[11] : months[idx - 1];
            bsDay = (engDay + 30 - data.start) + 1; // Approx previous month end
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

                // Format: आइतबार, माघ २, २०८२
                el.innerHTML = `${weekday}, ${bsMonth} ${toNepNum(bsDay)}, ${toNepNum(bsYear)}`;
            }
        });
    };

    // Initialize
    window.addEventListener('load', renderNepaliDate);
    setTimeout(renderNepaliDate, 1500);
})();
