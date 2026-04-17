(function() {
    // 1. CSS Styles (Grid & Responsive)
    const style = document.createElement('style');
    style.innerHTML = `
        .post-grid-wrapper { 
            max-width: 1000px; 
            margin: 20px auto; 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        }
        .cartoon-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 15px; 
            margin-bottom: 30px;
        }
        .grid-item { 
            border: 1px solid #eee; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.05); 
            transition: 0.3s; 
            background: #fff; 
        }
        .grid-item:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 8px 16px rgba(0,0,0,0.1); 
        }
        .grid-item img { 
            width: 100%; 
            height: 250px; 
            object-fit: contain; 
            background: #f9f9f9; 
            display: block; 
            cursor: zoom-in; 
        }
        
        /* Responsive Layout */
        @media (max-width: 900px) { .cartoon-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { 
            .cartoon-grid { grid-template-columns: 1fr; } 
            .grid-item img { height: auto; } 
        }
    `;
    document.head.appendChild(style);

    const mainContainer = document.getElementById('cartoon-grid-container');
    if (!mainContainer) return;

    // UI Structure
    mainContainer.innerHTML = `
        <div class="post-grid-wrapper">
            <div id="grid-portal" class="cartoon-grid">Loading gallery...</div>
        </div>
    `;

    const getProxy = (url) => url ? "https://images.weserv.nl/?url=" + encodeURIComponent(url.replace(/https?:\/\//, "")) : "";

    // Multi-function: Fetch and display ALL images instantly
    window.sbDisplayAllImages = function(json) {
        const entries = json.feed.entry || [];
        const targetSlug = "crimenews.html"; 
        
        const targetPost = entries.find(e => {
            const link = e.link.find(l => l.rel === 'alternate').href;
            return link.includes(targetSlug);
        });

        const portal = document.getElementById('grid-portal');

        if (!targetPost || !targetPost.content) {
            portal.innerHTML = "No images found in this specific post.";
            return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = targetPost.content.$t;
        const imgs = tempDiv.getElementsByTagName('img');

        if (imgs.length === 0) {
            portal.innerHTML = "No images detected.";
            return;
        }

        let gridHtml = '';
        // Loop through every image found and build the grid
        for (let i = 0; i < imgs.length; i++) {
            let src = imgs[i].src;
            // Convert to high-resolution link
            let highRes = src.replace(/\/s[0-9]+(-c)?\//, '/s1600/').replace(/=s[0-9]+(-c)?/, '=s1600');
            
            gridHtml += `
                <div class="grid-item">
                    <a href="${highRes}" target="_blank" title="View Full Image">
                        <img src="${getProxy(highRes)}" loading="lazy" alt="Gallery Image">
                    </a>
                </div>`;
        }
        
        portal.innerHTML = gridHtml; 
    };

    // Initialize API Sync
    const sbSync = () => {
        const s = document.createElement('script');
        s.src = `https://adsneelamb.blogspot.com/feeds/posts/default?alt=json-in-script&callback=sbDisplayAllImages&max-results=150`;
        document.body.appendChild(s);
    };

    sbSync();
})();