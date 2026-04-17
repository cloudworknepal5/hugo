(function() {
    const styleId = 'ad-grid-style-v3';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            .ad-grid-container { display: flex; flex-direction: column; gap: 20px; width: 100%; position: relative; }
            .ad-item { 
                width: 100%; border: 1px solid #ddd; border-radius: 4px; 
                overflow: hidden; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                position: relative;
            }
            .ad-item img { width: 100%; height: 100%; object-fit: fill; display: block; cursor: pointer; }
            .ad-badge {
                position: absolute; bottom: 0; right: 0;
                background: rgba(255, 255, 255, 0.8); color: #555;
                font-size: 10px; padding: 2px 6px; text-decoration: none;
                border-top-left-radius: 4px; z-index: 10; font-weight: bold;
                border-left: 1px solid #ddd; border-top: 1px solid #ddd;
            }
        `;
        document.head.appendChild(style);
    }

    window.renderAdGrid = function(config) {
        const targetId = config.containerId;
        const mainContainer = document.getElementById(targetId);
        if (!mainContainer) return;

        // सुरुमा कन्टटेनरलाई लुकाइदिने (ताकि खाली ठाउँ नदेखियोस्)
        mainContainer.style.display = 'none';

        const imgW = config.width || 970;
        const imgH = config.height || 200;
        const globalLink = config.link || '';
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

            // यदि विज्ञापन छ भने मात्र कन्टेनर देखाउने र HTML हाल्ने
            mainContainer.style.display = 'block';
            let gridHtml = `<div class="ad-grid-container" id="portal-${targetId}" style="max-width:${imgW}px; margin:auto;">`;
            
            for (let i = 0; i < imgs.length; i++) {
                let src = imgs[i].src;
                let altVal = imgs[i].alt || '';
                let customUrl = altVal.startsWith('http') ? altVal : (globalLink || src);
                let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
                let proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(highRes.replace(/https?:\/\//, ""))}&w=${imgW}&h=${imgH}&fit=fill`;

                gridHtml += `
                    <div class="ad-item" style="aspect-ratio: ${imgW}/${imgH};">
                        <a href="${customUrl}" target="_blank">
                            <img src="${proxyUrl}" loading="lazy" alt="Ad">
                        </a>
                        <a href="https://neelamb.com" target="_blank" class="ad-badge">adnp</a>
                    </div>`;
            }
            gridHtml += `</div>`;
            mainContainer.innerHTML = gridHtml;
        };

        let domain = (config.blogUrl || window.location.hostname).replace(/^https?:\/\//, '').replace(/\/$/, '');
        const s = document.createElement('script');
        s.src = `https://www.birgunj.eu.org/feeds/${feedType}/default?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(s);
    };
})();