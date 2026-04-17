/**
 * labelpost28.js - Multi-function Recent Posts Logic
 * Function Name: labelpost28
 */

function labelpost28(json, targetId) {
    var entries = json.feed.entry;
    var html = '';
    var container = document.getElementById(targetId);
    
    if (!container) return;

    if (entries && entries.length > 0) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var title = entry.title.$t;
            var link = "";
            
            // Post URL Finder
            for (var j = 0; j < entry.link.length; j++) {
                if (entry.link[j].rel == 'alternate') { link = entry.link[j].href; break; }
            }

            // Image Handler (High Res)
            var imgUrl = ("media$thumbnail" in entry) ? 
                         entry.media$thumbnail.url.replace('s72-c', 's1600') : 
                         "https://via.placeholder.com/1200x630?text=No+Image";

            var authorName = entry.author[0].name.$t;
            var authorImg = entry.author[0].gd$image.src.replace('s113', 's200');
            var date = new Date(entry.published.$t).toLocaleDateString('ne-NP', { 
                year: 'numeric', month: 'long', day: 'numeric' 
            });

            html += `
                <div class="lp28-item">
                    <h2 class="lp28-title"><a href="${link}">${title}</a></h2>
                    <div class="lp28-meta">
                        <img src="${authorImg}" class="lp28-author-img" onerror="this.src='https://www.blogger.com/img/profile_mask.png'">
                        <span>${authorName}</span> 
                        <span class="lp28-sep">|</span>
                        <span>${date}</span>
                    </div>
                    <div class="lp28-img-wrap">
                        <a href="${link}"><img src="${imgUrl}" alt="${title}"></a>
                    </div>
                </div>`;
        }
    } else {
        html = '<p>No recent posts found.</p>';
    }
    container.innerHTML = html;
}

/**
 * Multi-function Trigger for labelpost28
 * @param {number} count - Number of posts
 * @param {string} targetId - Container ID
 */
function runLabelPost28(count, targetId) {
    var callbackName = 'cb28_' + targetId.replace(/-/g, '_');
    window[callbackName] = function(json) { labelpost28(json, targetId); };

    var script = document.createElement('script');
    var feedUrl = window.location.origin + '/feeds/posts/default';
    script.src = feedUrl + '?alt=json-in-script&callback=' + callbackName + '&max-results=' + count;
    document.body.appendChild(script);
}
