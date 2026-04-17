(function() {
    const styleId = 'ad-grid-no-gap-final';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap');
            
            .ad-grid-container { width: 100%; margin: 10px auto; font-family: 'Mukta', sans-serif; }
            
            .ad-item { 
                display: flex; background: #fff; border: 1px solid #e0e0e0; 
                border-radius: 12px; overflow: hidden; height: 200px;
                transition: 0.3s ease; text-decoration: none !important; color: inherit;
                position: relative; align-items: stretch;
            }

            .ad-item:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-color: #ccc; }

            .ad-image-side { flex: 0 0 38%; overflow: hidden; background: #f9f9f9; }
            .ad-image-side img { width: 100%; height: 100%; object-fit: cover; display: block; transition: 0.5s; }
            .ad-item:hover .ad-image-side img { transform: scale(1.05); }

            .ad-content-side { 
                flex: 1; padding: 20px; display: flex; align-items: center; 
                justify-content: flex-start; overflow: hidden; background: #fff;
            }

            /* स्निपेटको माथिको ग्याप हटाउन मुख्य स्टाइल */
            .ad-snippet-html { 
                font-size: 17px; color: #333; line-height: 1.5; 
                max-height: 160px; width: 100%; overflow: hidden;
                opacity: 0; transform: translateY(10px);
                animation: fadeInUp 0.6s forwards 0.2s;
            }

            /* स्निपेट भित्रका पहिलो एलिमेन्टको मार्जिन हटाउने */
            .ad-snippet-html > *:first-child { margin-top: 0 !important; padding-top: 0 !important; }
            .ad-snippet-html img { display: none; }

            @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

            @media (max-width: 768px) {
                .ad-item { flex-direction: column; height: auto; }
                .ad-image-side { width: 100%; height: 160px; }
                .ad-content-side { padding: 15px; }
            }
        `;
        document.head.appendChild(style);
    }

    window.renderAdGrid = function(config) {
        const target = document.getElementById(config.containerId);
        if (!target) return;
        
        const identifier = (config.pageId || config.postId || "").toLowerCase();
        const callbackName = 'ad_cb_' + Math.random().toString(36).substr(2, 9);

        window[callbackName] = function(json) {
            const entry = json.feed.entry ? json.feed.entry.find(e => 
                e.link.find(l => l.rel === 'alternate').href.toLowerCase().includes(identifier)
            ) : null;

            if (!entry) { target.style.display = 'none'; return; }

            let rawHTML = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : "");
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHTML;

            // १. पहिलेका इमेजहरू हटाउने
            const firstImg = tempDiv.querySelector('img');
            let imgSrc = firstImg ? firstImg.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/') : 'https://placehold.co/800x450';
            
            const allImgs = tempDiv.querySelectorAll('img');
            allImgs.forEach(i => i.remove());

            // २. माथिको खाली भाग (Empty Tags) सफा गर्ने Multi-function Logic
            // यसले सुरुका खाली <p>, <br>, <div> आदि हटाउँछ
            while (tempDiv.firstChild && 
                  (tempDiv.firstChild.innerHTML === "" || 
                   tempDiv.firstChild.innerHTML === "&nbsp;" || 
                   tempDiv.firstChild.tagName === "BR")) {
                tempDiv.removeChild(tempDiv.firstChild);
            }

            const cleanHTML = tempDiv.innerHTML.trim();

            target.innerHTML = `
                <div class="ad-grid-container" style="max-width:${config.width}px;">
                    <a href="${config.link}" target="_blank" class="ad-item">
                        <div class="ad-image-side">
                            <img src="${imgSrc}" alt="Ad">
                        </div>
                        <div class="ad-content-side">
                            <div class="ad-snippet-html">${cleanHTML}</div>
                        </div>
                    </a>
                </div>`;
        };

        const feedType = config.isPage ? 'pages' : 'posts';
        const script = document.createElement('script');
        script.src = `https://${config.blogUrl}/feeds/${feedType}/default?alt=json-in-script&callback=${callbackName}`;
        document.body.appendChild(script);
    };
})();