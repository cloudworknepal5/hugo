var numPosts = 3; 
var snippetLength = 650; 
var targetLabel = "Featured"; // Change this to your label name

function showFeatured(json) {
    var container = document.getElementById('featured-container');
    var html = '';
    
    if (!json.feed.entry) {
        container.innerHTML = "No posts found with the label: " + targetLabel;
        return;
    }

    for (var i = 0; i < json.feed.entry.length; i++) {
        var entry = json.feed.entry[i];
        var title = entry.title.$t;
        var link = '';
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') { link = entry.link[k].href; break; }
        }
        
        var authorName = entry.author[0].name.$t;
        var authorImg = entry.author[0].gd$image.src.replace('/s113/', '/s100/');
        var date = new Date(entry.published.$t).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
        
        // High-resolution image logic
        var thumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s1600/') : 'https://via.placeholder.com/1200x600';
        
        var content = entry.summary ? entry.summary.$t : (entry.content ? entry.content.$t : "");
        var snippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, snippetLength) + '...';

        html += `
        <div class="fp-item">
            <h1 class="fp-title">${title}</h1>
            
            <div class="fp-meta">
                <img class="fp-author-img" src="${authorImg}" alt="${authorName}">
                <span><b>${authorName}</b></span>
                <span>|</span>
                <span>${date}</span>
            </div>

            <div class="fp-image-wrap">
                <a href="${link}"><img src="${thumb}" alt="${title}"></a>
            </div>

            <p class="fp-snippet">${snippet}</p>
            
            <a href="${link}" class="fp-readmore">Continue Reading</a>
        </div>`;
    }
    container.innerHTML = html;
}

// Fixed link to fetch from specific label
document.write('<script src="/feeds/posts/default/-/' + targetLabel + '?alt=json-in-script&max-results=' + numPosts + '&callback=showFeatured"><\/script>');