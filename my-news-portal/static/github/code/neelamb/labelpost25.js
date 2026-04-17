function renderProLayout(jsonH, jsonF) {
    // १० वटा हेडलाइन भर्ने
    var hPosts = jsonH.feed.entry || [];
    var hHtml = "";
    hPosts.forEach((e, index) => {
        var link = e.link.find(l => l.rel === 'alternate').href;
        // नम्बर थपिएको खण्ड
        hHtml += `
            <div class="mn-list-item">
                <div class="mn-number">${index + 1}</div>
                <a href="${link}">${e.title.$t}</a>
            </div>`;
    });
    document.getElementById("mn-headline-list").innerHTML = hHtml;

    // मुख्य समाचार भर्ने (१ ठूलो, २ साना)
    var fPosts = jsonF.feed.entry || [];
    if (!fPosts.length) return;

    var main = fPosts[0];
    var mImg = main.media$thumbnail ? main.media$thumbnail.url.replace('s72-c', 's800') : 'https://via.placeholder.com/800x400';
    var mLink = main.link.find(l => l.rel === 'alternate').href;

    var fHtml = `
        <div class="mn-main-card">
            <a href="${mLink}"><img src="${mImg}"></a>
            <h2><a href="${mLink}">${main.title.$t}</a></h2>
        </div>
        <div class="mn-sub-grid">`;


  
    for (var i = 1; i < Math.min(fPosts.length, 3); i++) {
        var sub = fPosts[i];

    var mImg = main.media$thumbnail ? main.media$thumbnail.url.replace('s72-c', 's800') : 'https://via.placeholder.com/800x400';
    var mLink = main.link.find(l => l.rel === 'alternate').href;

        fHtml += `
            <div class="mn-sub-card">
                <a href="${sLink}"><img src="${sImg}"></a>
                <h3><a href="${sLink}">${sub.title.$t}</a></h3>
            </div>`;
    }
    fHtml += `</div>`;
    document.getElementById("mn-feature-box").innerHTML = fHtml;
}

function initMainNewsHeadlines(catH, catF) {
    var s1 = document.createElement('script');
    // max-results=10 बनाइएको छ
    s1.src = `/feeds/posts/default/-/${encodeURIComponent(catH)}?alt=json-in-script&callback=mnCBH&max-results=10`;
    
    var s2 = document.createElement('script');
    s2.src = `/feeds/posts/default/-/${encodeURIComponent(catF)}?alt=json-in-script&callback=mnCBF&max-results=3`;
    
    window.mnCBH = j => { window.hData = j; if(window.fData) renderProLayout(window.hData, window.fData); };
    window.mnCBF = j => { window.fData = j; if(window.hData) renderProLayout(window.hData, window.fData); };

    document.head.appendChild(s1);
    document.head.appendChild(s2);
}
