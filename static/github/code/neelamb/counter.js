/**
 * counter.js - Multi-function Universal Solution
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
        // Path सुरक्षित बनाउने (Firebase ले $ . # [ ] स्वीकार गर्दैन)
        const postId = window.location.pathname.replace(/[\/\.#\$\[\]]/g, "_") || "home";
        const url = `${this.config.databaseURL}/views/${postId}.json`;
        
        const hasVisited = sessionStorage.getItem("v_" + postId);

        try {
            const res = await fetch(url);
            let count = await res.json();
            
            // डेटा शुद्धिकरण
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
                el.innerHTML = `<span style="font-weight:bold; color:#ce1212;">${this.toNepali(count)} पटक हेरियो</span>`;
            }
        } catch (e) {
            console.error("Firebase Error:", e);
            if (el) el.innerHTML = "० पटक हेरियो";
        }
    }
};

// तत्काल र सुरक्षित रूपमा सुरु गर्ने
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BloggerCounter.updateAndFetch("visitor-count"));
} else {
    BloggerCounter.updateAndFetch("visitor-count");
}
