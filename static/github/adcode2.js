<script>
/**
 * Name: NeelamB Smart Ad-Engine v4.8
 * Features: Multi-function Tracking, City/Country, Auto-Hide, High-Res Proxy
 */
(function() {
    // १. CSS स्टाइल लोड गर्ने
    const styleId = 'ad-grid-style-v4-8';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .ad-grid-container { display: flex; flex-direction: column; gap: 20px; width: 100%; position: relative; }
            .ad-item { 
                width: 100%; border: 1px solid #ddd; border-radius: 8px; 
                overflow: hidden; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                position: relative; 
            }
            .ad-item img { width: 100%; height: 100%; object-fit: fill; display: block; cursor: pointer; }
            .ad-badge {
                position: absolute; bottom: 0; right: 0;
                background: rgba(255, 255, 255, 0.85); color: #333;
                font-size: 10px; padding: 3px 8px; text-decoration: none;
                border-top-left-radius: 6px; z-index: 10; font-weight: bold;
                border-left: 1px solid #ddd; border-top: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }

    // २. डेटा पठाउने फङ्सन (Multi-function Tracking)
    const trackAdAction = async (actionType, adSrc) => {
        const cloudURL = 'https://script.google.com/macros/s/AKfycbzjCxQtOrduPkdEHP6eVVwCh1NiHrHRDka78zdkqaY-6t--1Gy3mScdyAffkvHufjaS/exec';
        
        let geo = { ip: "Unknown", country: "Unknown", city: "Unknown" };
        try {
            // भरपर्दो लोकेसन सर्भिस
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            geo = { ip: data.ip, country: data.country_name, city: data.city };
        } catch (e) {
            console.log("Geo tracking blocked.");
        }

        const payload = {
            event: actionType,
            source: adSrc,
            ip: geo.ip,
            country: geo.country,
            city: geo.city,
            platform: navigator.platform
        };

        // क्लाउडमा डेटा पठाउने (No-cors mode)
        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    // ३. मुख्य विज्ञापन रेन्डर इन्जिन
    window.renderAdGrid = function(config) {
        const targetId = config.containerId;
        const mainContainer = document.getElementById(targetId);
        if (!mainContainer) return;

        // सुरुमा कन्टेनर लुकाउने (Invisible logic)
        mainContainer.style.display = 'none';

        const imgW = config.width || 970;
        const imgH = config.height || 200;
        const identifier = (config.postId || config.pageId || "").toLowerCase();
        const feedType = config.isPage ? 'pages' : 'posts';
        const callbackName = 'callback_' + targetId.replace(/-/g, '_');

        window[callbackName] = function(json) {
            if (!json.feed || !json.feed.entry) return;

            const targetEntry = json.feed.entry.find(e => {
                const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
                return link.includes(identifier);
            });

            if (!targetEntry) return;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = targetEntry.content.$t;
            const imgs = tempDiv.getElementsByTagName('img');

            if (imgs.length === 0) return;

            // विज्ञापन भेटिएपछि मात्र कन्टेनर देखाउने
            mainContainer.style.display = 'block';
            let gridHtml = `<div class="ad-grid-container" style="max-width:${imgW}px; margin:auto;">`;
            
            for (let i = 0; i < imgs.length; i++) {
                let rawSrc = imgs[i].src;
                let highRes = rawSrc.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
                let targetUrl = imgs[i].alt.startsWith('http') ? imgs[i].alt : (config.link || highRes);

                // View ट्रयाकिङ कल
                trackAdAction('VIEW', highRes);

                gridHtml += `
                    <div class="ad-item" style="aspect-ratio: ${imgW}/${imgH};">
                        <a href="${targetUrl}" target="_blank" class="nl-ad-link" data-src="${highRes}">
                            <img src="https://images.weserv.nl/?url=${encodeURIComponent(highRes.replace(/https?:\/\//, ""))}&w=${imgW}&h=${imgH}&fit=fill" loading="lazy">
                        </a>
                        <a href="https://neelamb.com" target="_blank" class="ad-badge">adnp</a>
                    </div>`;
            }
            gridHtml += `</div>`;
            mainContainer.innerHTML = gridHtml;

            // क्लिक ट्रयाकिङ इभेन्ट
            mainContainer.querySelectorAll('.nl-ad-link').forEach(link => {
                link.addEventListener('click', function() {
                    trackAdAction('CLICK', this.getAttribute('data-src'));
                });
            });
        };

        // फिड लोड गर्ने
        const s = document.createElement('script');
        s.src = `https://www.birgunj.eu.org/feeds/${feedType}/default?alt=json-in-script&callback=${callbackName}`;
        document.body.appendChild(s);
    };
})();
</script>