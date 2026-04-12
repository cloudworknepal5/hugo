function renderRecentByLabel(json) {
    var entries = json.feed.entry;
    var html = '<div class="lp-container">';

    if (entries) {
        // --- पहिलो (Featured) पोस्ट ---
        var fPost = entries[0];
        var fTitle = fPost.title.$t;
        var fLink = fPost.link.find(l => l.rel === 'alternate').href;
        var fImg = fPost.media$thumbnail ? fPost.media$thumbnail.url.replace('s72-c', 's1600') : 'https://via.placeholder.com/600x300';
        
        // स्निपेट (10 शब्द)
        var content = fPost.content ? fPost.content.$t : (fPost.summary ? fPost.summary.$t : "");
        var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).slice(0, 10).join(" ") + "...";

        html += '<div class="lp-featured">';
        html += '<h2><a href="' + fLink + '">' + fTitle + '</a></h2>';
        html += '<a href="' + fLink + '"><img src="' + fImg + '"/></a>';
        html += '<p class="lp-snippet">' + snippet + '</p>';
        html += '</div>';

        // --- दोस्रो र तेस्रो पोस्ट (Grid) ---
        html += '<div class="lp-grid">';
        for (var i = 1; i < 3; i++) {
            if (entries[i]) {
                var post = entries[i];
                var title = post.title.$t;
                var link = post.link.find(l => l.rel === 'alternate').href;
                var img = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's400') : 'https://via.placeholder.com/200x150';

                html += '<div class="lp-item">';
                html += '<a href="' + link + '"><img src="' + img + '"/></a>';
                html += '<h3><a href="' + link + '">' + title + '</a></h3>';
                html += '</div>';
            }
        }
        html += '</div>'; // End Grid
    }
    
    html += '</div>'; // End Container
    document.getElementById('recent-posts-box').innerHTML = html;
}
