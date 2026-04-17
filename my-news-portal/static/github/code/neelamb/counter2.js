/**
 * counter.js - Multi-function Universal Solution with Icon
 */
const BloggerCounter = {
    config: {
        databaseURL: "https://counter-3ff08-default-rtdb.asia-southeast1.firebasedatabase.app",
        numMap: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'}
    },

    toNepali: function(num) {
        let n = parseInt(num) || 0;
        return n.toString().split('').map(char => this.config.numMap[char] || char).join('');
    },

    updateAndFetch: async function(elementId) {
        const el = document.getElementById(elementId);
        const postId = window.location.pathname.replace(/[\/\.#\$\[\]]/g, "_") || "home";
        const url = `${this.config.databaseURL}/views/${postId}.json`;
        
        const hasVisited = sessionStorage.getItem("v_" + postId);

        try {
            const res = await fetch(url);
            let count = await res.json();
            
            count = (typeof count === 'number') ? count : 0;

            if (!hasVisited) {
                count += 1;
                await fetch(url, {
                    method: 'PUT',
                    body: JSON.stringify(count)
                });
                sessionStorage.setItem("v_" + postId, "true");
            }

            if (el) {
                // १. आइकनको लागि SVG कोड
                const eyeIcon = `<svg style="width:20px; height:20px; margin-right:7px; fill:#ce1212; vertical-align:middle; display:inline-block;" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4 142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.4 78.1-95.4 92.9-131.1 3.3-7.9 3.3-16.7 0-24.6C558.7 208 527.4 156 480.6 112.6 433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64a64 64 0 1 0 0 128 64 64 0 1 0 0-128z"/></svg>`;
                
                // २. आइकन र टेक्स्टलाई एउटै लाइनमा मिलाउने
                el.innerHTML = `<div style="display:flex; align-items:center; color:#ce1212; font-weight:bold;">${eyeIcon} <span>${this.toNepali(count)} पटक हेरियो</span></div>`;
            }
        } catch (e) {
            console.error("Firebase Error:", e);
            if (el) el.innerHTML = "० पटक हेरियो";
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BloggerCounter.updateAndFetch("visitor-count"));
} else {
    BloggerCounter.updateAndFetch("visitor-count");
}
