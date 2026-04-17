/**
 * GitHub Feed Widget - Multi-function Version
 * Features: 
 * 1. Auto-detect Blogger Feed URL
 * 2. AD to BS Nepali Date Converter
 * 3. HD Image Optimizer
 * 4. Load More Pagination
 */
class GHFeedWidget {
    constructor(options) {
        this.containerId = options.containerId;
        this.loadMoreBtnId = options.loadMoreBtnId;
        
        // Function 1: Auto-detect Feed URL if not provided
        this.feedUrl = options.feedUrl || `${window.location.origin}/feeds/posts/default`;
        
        this.postsPerPage = options.postsPerPage || 5;
        this.posts = [];
        this.displayedCount = 0;

        this.init();
    }

    // Function 2: English Date to Nepali Date (BS) Converter
    getNepaliDate(dateString) {
        const date = new Date(dateString);
        
        // Nepali Data Mapping
        const nepMonths = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कात्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
        const nepNumbers = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};

        // Basic AD to BS offset calculation (Approximate)
        let year = date.getFullYear() + 56;
        let month = date.getMonth() + 8;
        let day = date.getDate() + 17;

        // Adjusting months/days overflow
        if (day > 30) { day -= 30; month++; }
        if (month > 11) { month -= 12; year++; }

        // Localized Number Helper
        const toNepNum = (num) => num.toString().split('').map(d => nepNumbers[d] || d).join('');

        return `${toNepNum(day)} ${nepMonths[month]} ${toNepNum(year)}`;
    }

    // Function 3: Clear HD Image Processor
    getClearHDImage(url) {
        if (!url) return 'https://via.placeholder.com/1300x700';
        let hd = url.replace(/\/s[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
        hd = hd.replace(/\/w[0-9]+-h[0-9]+(-[a-z0-9-]+)?\//, '/s1600/');
        if (hd.indexOf('=s') > -1) hd = hd.split('=s')[0] + '=s1600';
        return hd;
    }

    // Function 4: JSONP Data Initialization
    init() {
        const script = document.createElement('script');
        const callbackName = `ghCB_${Math.random().toString(36).substr(2, 9)}`;
        
        window[callbackName] = (data) => this.handleData(data);
        
        script.src = `${this.feedUrl}?alt=json-in-script&callback=${callbackName}&max-results=50`;
        document.body.appendChild(script);

        const btn = document.getElementById(this.loadMoreBtnId);
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                this.renderChunk();
            };
        }
    }

    handleData(data) {
        this.posts = data.feed.entry || [];
        if (this.posts.length > 0) {
            this.renderChunk();
        }
    }

    // Function 5: UI/HTML Generator
    createPostHTML(post) {
        const title = post.title.$t;
        const link = post.link.find(l => l.rel === 'alternate').href;
        const authorPic = post.author[0].gd$image.src.replace('/s35-c/', '/s100-c/');
        const thumb = post.media$thumbnail ? this.getClearHDImage(post.media$thumbnail.url) : 'https://via.placeholder.com/1300x700';
        const snip = (post.content.$t || post.summary.$t).replace(/<[^>]*>?/gm, '').trim().split(/\s+/).slice(0, 25).join(" ") + "...";
        const label = post.category ? post.category[0].term : "समाचार";
        
        // Applying the Nepali Date Function
        const nepaliDate = this.getNepaliDate(post.published.$t);

        return `
            <article class="gh-master-wrap">
                <a href="${link}" class="gh-headline-top">${title}</a>
                <div class="gh-meta-info">
                    <img src="${authorPic}" class="gh-author-img" alt="${post.author[0].name.$t}">
                    <span class="gh-author-name"><b>${post.author[0].name.$t}</b></span>
                    <span style="color:#ccc">|</span>
                    <span class="location-date">${nepaliDate}</span>
                </div>
                <div class="gh-img-frame">
                    <div class="gh-label-ribbon">${label}</div>
                    <div class="gh-social-overlay-center">
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="FB"></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WA"></a>
                        <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YT"></a>
                    </div>
                    <div class="gh-overlay-border"></div>
                    <a href="${link}"><img src="${thumb}" loading="lazy"></a>
                </div>
                <p class="gh-snippet">${snip}</p>
                <a href="${link}" class="gh-read-more">थप पढ्नुहोस्</a>
                <hr class="gh-post-divider">
            </article>
        `;
    }

    // Function 6: Chunk Rendering (Pagination)
    renderChunk() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const chunk = this.posts.slice(this.displayedCount, this.displayedCount + this.postsPerPage);
        
        chunk.forEach(p => {
            container.insertAdjacentHTML('beforeend', this.createPostHTML(p));
        });

        this.displayedCount += chunk.length;

        // Hide Load More button if no more posts
        if (this.displayedCount >= this.posts.length) {
            const btn = document.getElementById(this.loadMoreBtnId);
            if (btn) btn.style.display = 'none';
        }
    }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    new GHFeedWidget({
        containerId: 'gh-final-master-widget',
        loadMoreBtnId: 'loadMoreBtn',
        postsPerPage: 1 // Showing 1 post at a time as requested
    });
});
