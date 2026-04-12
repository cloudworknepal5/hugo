(function() {
    // १. CSS Injector: पप-अप र चक्कर एनिमेसन स्टाइल
    const injectStyles = () => {
        const css = `
            #ad-3d-popup-overlay {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex; justify-content: center; align-items: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.5s ease;
            }
            #ad-3d-wrapper {
                position: relative;
                width: 300px;
                height: 200px;
                perspective: 1200px;
                /* पप-अप चक्कर एनिमेसन */
                animation: popupSpin 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .carousel-3d {
                width: 100%;
                height: 100%;
                position: absolute;
                transform-style: preserve-3d;
                animation: rotateLoop 15s infinite linear;
            }
            @keyframes popupSpin {
                0% { transform: scale(0) rotate(-720deg); opacity: 0; }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes rotateLoop {
                from { transform: rotateY(0deg); }
                to { transform: rotateY(360deg); }
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            
            .ad-slice {
                position: absolute;
                width: 250px;
                height: 150px;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                backface-visibility: visible;
                border: 2px solid #fff;
            }
            .ad-slice img { width: 100%; height: 100%; object-fit: cover; }
            
            .close-popup {
                position: absolute;
                top: -40px; right: -40px;
                background: white; color: black;
                border: none; border-radius: 50%;
                width: 35px; height: 35px;
                cursor: pointer; font-size: 20px; font-weight: bold;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            }

            @media screen and (max-width: 768px) {
                #ad-3d-wrapper { transform: scale(0.7); }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    };

    const cloudURL = 'https://script.google.com/macros/s/AKfycbwIEUX7nS_iBTJfwG4G6RVnalfNLracsAQZlZl9m78M3_Fkmwug63h8QnfrgA2xQ-8azA/exec';

    // २. Geo & Device Info Function
    const getClientDetails = async () => {
        try {
            const res = await fetch('https://freeipapi.com/api/json');
            const d = await res.json();
            return { ip: d.ipAddress, co: d.countryName, ct: d.cityName };
        } catch (e) { return { ip: "Private", co: "Global", ct: "Unknown" }; }
    };

    // ३. Tracking Multi-function (View/Click events)
    window.trackAdAction = async (type, data) => {
        const geo = await getClientDetails();
        const payload = {
            event: type, 
            adId: data.id, 
            imageUrl: data.src, 
            targetUrl: data.link,
            ip: geo.ip, 
            country: geo.co, 
            city: geo.ct, 
            platform: navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform
        };
        // No-cors mode to prevent preflight issues with Google Apps Script
        fetch(cloudURL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload) });
    };

    // ४. 3D HTML Builder Function
    const createSlice = (src, link, index, total, id) => {
        const angle = (360 / total) * index;
        const translateZ = Math.round(150 / Math.tan(Math.PI / total)) || 150;

        return `
            <div class="ad-slice" style="transform: rotateY(${angle}deg) translateZ(${translateZ}px);">
                <a href="${link}" target="_blank" onclick="trackAdAction('CLICK', {id:'${id}', src:'${src}', link:'${link}'})">
                    <img src="${src}" alt="Ad">
                </a>
            </div>`;
    };

    // ५. Main Rendering Multi-function
    window.renderPopUp3D = function(cfg) {
        injectStyles();
        
        // पप-अप कन्टेनर बनाउने
        const overlay = document.createElement('div');
        overlay.id = 'ad-3d-popup-overlay';
        overlay.innerHTML = `
            <div id="ad-3d-wrapper">
                <button class="close-popup" onclick="this.closest('#ad-3d-popup-overlay').remove()">×</button>
                <div id="${cfg.containerId}" class="carousel-3d"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const container = document.getElementById(cfg.containerId);
        const callbackName = 'callback_' + cfg.containerId.replace(/-/g, '_');

        // JSONP Callback Handling
        window[callbackName] = function(json) {
            if(!json.feed || !json.feed.entry) return;
            
            const entry = json.feed.entry.find(e => 
                e.link.some(l => l.rel === 'alternate' && l.href.toLowerCase().includes(cfg.pageId.toLowerCase()))
            );
            
            if (!entry) return;

            const doc = new DOMParser().parseFromString(entry.content.$t, 'text/html');
            const imgs = Array.from(doc.querySelectorAll('img'));
            
            let htmlContent = '';
            imgs.forEach((img, index) => {
                const highResSrc = img.src.replace(/\/s[0-9]+(-c)?\//, '/s1600/');
                const targetLink = img.alt && img.alt.startsWith('http') ? img.alt : cfg.link;
                
                // Track View
                trackAdAction('VIEW', { id: cfg.pageId, src: highResSrc, link: targetLink });
                
                htmlContent += createSlice(highResSrc, targetLink, index, imgs.length, cfg.pageId);
            });
            
            container.innerHTML = htmlContent;
        };

        // Data Fetching
        const script = document.createElement('script');
        script.src = `https://adnp.neelamb.com/feeds/pages/default?alt=json-in-script&callback=${callbackName}`;
        document.body.appendChild(script);
    };
})();