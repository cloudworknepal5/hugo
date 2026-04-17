/**
 * Name: NeelamB HTML5 Ad-Engine v4.7
 * Features: Platform Tracking, Click/View Distinction, Cloud Sync
 */
(function() {
    // तपाईँको एक्टिभ Web App URL
    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';

    // MULTI-FUNCTION GEO LOCATOR
    const getGeo = async () => {
        try {
            const res = await fetch('https://ipapi.co/json/');
            if (!res.ok) throw new Error();
            const d = await res.json();
            return { ip: d.ip, country: d.country_name, city: d.city };
        } catch (e) { 
            // यदि पहिलो API फेल भयो भने यो चल्छ
            return { ip: "Private", country: "Unknown", city: "Unknown" }; 
        }
    };

    const track = async (type, info) => {
        const geo = await getGeo();
        const payload = {
            event: type, 
            adId: info.id, 
            imageUrl: info.src, 
            targetUrl: info.link,
            ip: geo.ip, 
            country: geo.country, 
            city: geo.city,
            platform: navigator.platform, // ड्यासबोर्डमा यो देखिनेछ
            timestamp: new Date().toISOString()
        };
        
        // Google Cloud मा डेटा पठाउने
        fetch(cloudURL, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(payload) 
        });
    };

    window.renderAdGrid = function(cfg) {
        const container = document.getElementById(cfg.containerId);
        if (!container) return;
        const cb = 'cb_' + cfg.containerId.replace(/-/g, '_');

        window[cb] = function(json) {
            const entry = json.feed.entry.find(e => e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(cfg.pageId.toLowerCase()));
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            
            let html = `<div style="display:flex; flex-direction:column; gap:10px;">`;
            imgs.forEach(img => {
                if(!img.src) return;
                let src = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                let link = img.alt && img.alt.startsWith('http') ? img.alt : cfg.link;
                
                // १. विज्ञापन देखिने बित्तिकै VIEW ट्रयाक गर्ने
                track('VIEW', { id: cfg.pageId, src: src, link: link });

                html += `
                <div style="position:relative; border-radius:8px; overflow:hidden; border:1px solid #ddd; background:#fff;">
                    <a href="${link}" target="_blank" onclick="track('CLICK', {id:'${cfg.pageId}', src:'${src}', link:'${link}'})">
                        <img src="${src}" style="width:100%; display:block;">
                    </a>
                    <span style="position:absolute; bottom:0; right:0; background:rgba(255,255,255,0.8); font-size:10px; padding:2px 5px; font-weight:bold; color:#555;">AD</span>
                </div>`;
            });
            container.innerHTML = html + `</div>`;
        };

        const s = document.createElement('script');
        s.src = `https://www.birgunj.eu.org/feeds/pages/default?alt=json-in-script&callback=${cb}`;
        document.body.appendChild(s);
    };
})();