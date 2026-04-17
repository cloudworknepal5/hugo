(function() {
    const styleId = 'ad-grid-html5-premium';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600&family=Roboto:wght@400;500&display=swap');
            
            .ad-grid-container { 
                display: flex; flex-direction: column; gap: 20px; 
                width: 100%; max-width: 970px; margin: auto;
            }
            
            .ad-item { 
                display: flex; flex-direction: row; gap: 0;
                background: #ffffff; border: 1px solid #e0e0e0;
                border-radius: 12px; overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                font-family: 'Mukta', sans-serif; /* नेपाली फन्टको लागि राम्रो विकल्प */
            }

            .ad-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                border-color: #d1d1d1;
            }

            .ad-image-side { 
                flex: 0 0 38%; min-height: 220px;
                position: relative; overflow: hidden;
                background: #f8f9fa;
            }

            .ad-image-side img { 
                width: 100%; height: 100%; 
                object-fit: cover; display: block;
                transition: transform 0.5s ease;
            }

            .ad-item:hover .ad-image-side img {
                transform: scale(1.05);
            }

            .ad-content-side { 
                flex: 1; padding: 20px 25px;
                display: flex; flex-direction: column;
                justify-content: center; position: relative;
                background: linear-gradient(to right, #ffffff, #fafafa);
            }

            /* आकर्षक स्निपेट स्टाइल */
            .ad-content-side .inner-snippet {
                font-size: 16px; color: #444; line-height: 1.7;
                display: -webkit-box; -webkit-line-clamp: 5;
                -webkit-box-orient: vertical; overflow: hidden;
            }

            .ad-content-side p { margin-bottom: 12px; }
            .ad-content-side b, .ad-content-side strong { color: #1a73e8; font-weight: 600; }

            /* विज्ञापन सूचक बटन */
            .ad-cta {
                display: inline-block; margin-top: 15px;
                color: #1a73e8; font-weight: 600; font-size: 14px;
                text-transform: uppercase; letter-spacing: 0.5px;
            }

            .ad-badge-link {
                position: absolute; top: 10px; right: 15px;
                font-size: 9px; color: #aaa; text-transform: uppercase;
                letter-spacing: 1px; text-decoration: none;
            }

            @media (max-width: 768px) {
                .ad-item { flex-direction: column; border-radius: 8px; }
                .ad-image-side { flex: 0 0 200px; }
                .ad-content-side { padding: 15px; }
                .ad-content-side .inner-snippet { -webkit-line-clamp: 4; }
            }
        `;
        document.head.appendChild(style);
    }

    // Multi-functional logic: पोस्ट र पेज दुवैको लागि HTML5 Ad Style
    window.renderAdGrid = function(config) {
        const targetId = config.containerId;
        const mainContainer = document.getElementById(targetId);
        if (!mainContainer) return;

        const identifier = (config.postId || config.pageId || "").toLowerCase();
        const feedType = config.isPage ? 'pages' : 'posts';
        mainContainer.innerHTML = `<div id="portal-${targetId}" style="text-align:center; padding:20px; color:#666;">विज्ञापन लोड हुँदैछ...</div>`;

        const callbackName = 'callback_' + targetId.replace(/-/g, '_');

        window[callbackName] = function(json) {
            const portal = document.getElementById('portal-' + targetId);
            if (!json.feed || !json.feed.entry) { portal.innerHTML = ""; return; }

            const targetEntry = json.feed.entry.find(e => {
                const link = e.link.find(l => l.rel === 'alternate').href.toLowerCase();
                return link.includes(identifier);
            });

            if (!targetEntry) { portal.innerHTML = ""; return; }

            const rawContent = targetEntry.content ? targetEntry.content.$t : targetEntry.summary.$t;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawContent;
            
            const imgs = Array.from(tempDiv.getElementsByTagName('img'));
            imgs.forEach(img => img.remove());

            // अनावश्यक स्पेस र ट्याग सफा गर्ने
            let cleanHtml = tempDiv.innerHTML.trim().replace(/^(<br\s*\/?>|&nbsp;|\s)+/gi, '');

            let gridHtml = '<div class="ad-grid-container">';
            
            imgs.forEach((img) => {
                let src = img.src;
                let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
                let targetLink = config.link || src;

                gridHtml += `
                    <div class="ad-item">
                        <div class="ad-image-side">
                            <a href="${targetLink}" target="_blank">
                                <img src="${highRes}" alt="Promotion">
                            </a>
                        </div>
                        <div class="ad-content-side">
                            <a href="https://neelamb.com" target="_blank" class="ad-badge-link">Sponsored</a>
                            <div class="inner-snippet">
                                ${cleanHtml}
                            </div>
                            <a href="${targetLink}" target="_blank" class="ad-cta">थप जानकारी →</a>
                        </div>
                    </div>`;
            });

            gridHtml += '</div>';
            portal.innerHTML = gridHtml;
        };

        let domain = (config.blogUrl || window.location.hostname).replace(/^https?:\/\//, '').replace(/\/$/, '');
        const s = document.createElement('script');
        s.src = `https://${domain}/feeds/${feedType}/default?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(s);
    };
})();