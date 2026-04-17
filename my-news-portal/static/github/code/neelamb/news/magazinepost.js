function loadMagazineFeed(json) {
    var entries = json.feed.entry;
    var leftMain = document.getElementById('left-main');
    var leftBottom = document.getElementById('left-bottom');
    var rightSide = document.getElementById('right-side');

    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var title = entry.title.$t;
        var link = "";
        for (var k = 0; k < entry.link.length; k++) {
            if (entry.link[k].rel == 'alternate') { link = entry.link[k].href; break; }
        }
        var img = entry.media$thumbnail ? entry.media$thumbnail.url.replace('s72-c', 'w600-h400-c') : 'https://via.placeholder.com/600x400';

        var html = `<div class="news-card"><a href="${link}"><img src="${img}"><h2 class="headline">${title}</h2></a></div>`;

        if (i === 0) {
            // १ नम्बरको ठूलो पोस्ट
            leftMain.innerHTML = html;
        } else if (i > 0 && i < 3) {
            // २ र ३ नम्बरको पोस्ट
            leftBottom.innerHTML += html;
        } else {
            // ५-९ सम्मको साइड लिस्ट
            var listHtml = `
                <div class="list-item">
                    <a href="${link}"><img src="${img}"></a>
                    <a href="${link}"><h2 class="headline" style="font-size:16px;">${title}</h2></a>
                </div>`;
            rightSide.innerHTML += listHtml;
        }
    }
}
