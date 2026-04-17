/**
 * Multi-function Blogger Loop Logic
 * GitHub Hostable Version
 */
function renderNewsLoop(json) {
    var entries = json.feed.entry;
    var html = '';
    
    if (entries) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var title = entry.title.$t;
            var link = "";
            var imgUrl = "";
            var authorName = entry.author[0].name.$t;
            var authorImg = entry.author[0].gd$image.src.replace('s113', 's200');
            var date = new Date(entry.published.$t).toLocaleDateString('ne-NP', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            });

            for (var j = 0; j < entry.link.length; j++) {
                if (entry.link[j].rel == 'alternate') { link = entry.link[j].href; break; }
            }

            if ("media$thumbnail" in entry) {
                imgUrl = entry.media$thumbnail.url.replace('s72-c', 's1600');
            } else {
                imgUrl = "https://via.placeholder.com/1200x630?text=No+Image";
            }

            html += `
                <div class="featured-loop-item">
                    <span class="tag-label">विशेष समाचार</span>
                    <h2 class="featured-title"><a href="${link}">${title}</a></h2>
                    <div class="featured-meta">
                        <img src="${authorImg}" class="author-thumb" onerror="this.src='https://www.blogger.com/img/profile_mask.png'">
                        <span>${authorName}</span> 
                        <span style="color:#ddd;">|</span>
                        <span>${date}</span>
                    </div>
                    <div class="featured-img-wrap">
                        <a href="${link}"><img src="${imgUrl}" alt="${title}"></a>
                    </div>
                </div>`;
        }
    } else {
        html = '<p>डाटा फेला परेन।</p>';
    }
    document.getElementById('image-loop-container').innerHTML = html;
}

function startResponsiveLoop(label, count) {
    var script = document.createElement('script');
    var feedUrl = window.location.origin + '/feeds/posts/default';
    if (label !== 'recent') feedUrl += '/-/' + encodeURIComponent(label);
    script.src = feedUrl + '?alt=json-in-script&callback=renderNewsLoop&max-results=' + count;
    document.body.appendChild(script);
}
