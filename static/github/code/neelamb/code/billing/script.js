function renderRecentVerticalPosts(json) {
    var entries = json.feed.entry;
    var html = '<div class="vertical-recent-container">';

    if (!entries) return;

    for (var i = 0; i < 3; i++) {
        if (entries[i]) {
            var post = entries[i];
            var title = post.title.$t;
            var link = post.link.find(l => l.rel === 'alternate').href;
            var img = post.media$thumbnail ? post.media$thumbnail.url.replace('s72-c', 's1200') : 'https://via.placeholder.com/1200x630';
            
            var authorName = post.author[0].name.$t;
            var authorImg = post.author[0].gd$image.src.replace('/s512-c/', '/s80-c/'); 
            var pubDate = new Date(post.published.$t).toLocaleDateString('ne-NP');

            // 60 Word Snippet (Change to 10 if needed)
            var content = post.content ? post.content.$t : (post.summary ? post.summary.$t : "");
            var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").split(/\s+/).slice(0, 60).join(" ") + "...";

            html += '<article class="vr-post">';
            html += '<h2 class="vr-title"><a href="' + link + '">' + title + '</a></h2>';
            
            html += '<div class="vr-meta">';
            html += '<img class="vr-author-img" src="' + authorImg + '" />';
            html += '<div class="vr-meta-info">';
            html += '<strong>' + authorName + '</strong>';
            html += '<span class="vr-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + pubDate + '</span>';
            html += '</div></div>';

            html += '<div class="vr-image"><a href="' + link + '"><img src="' + img + '"/></a></div>';
            html += '<div class="vr-snippet">' + snippet + '</div>';
            html += '<a href="' + link + '" class="vr-btn">विस्तृतमा पढ्नुहोस्</a>';
            html += '</article>';
        }
    }
    html += '</div>';
    document.getElementById('recent-vertical-box').innerHTML = html;
}
