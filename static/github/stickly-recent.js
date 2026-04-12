(function() {
    // १. CSS: डिजाइन र फ्लोटिङ सेटिङ
    const style = document.createElement('style');
    style.textContent = `
        #floating-wrapper {
            position: fixed;
            top: 100px;
            right: 15px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        .tabs-trigger { display: flex; gap: 8px; }
        .tab-btn {
            width: 52px; height: 52px;
            background: #bc1d22 !important;
            border-radius: 50% !important;
            border: 2px solid #fff !important;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            font-size: 10px;
            font-weight: bold;
            transition: 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .tab-btn.active { background: #333 !important; }
        #news-content {
            width: 280px;
            background: #fff !important;
            border-radius: 12px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        #news-content.show { max-height: 450px; border: 1px solid #ddd; }
        .content-area { overflow-y: auto; max-height: 400px; padding: 5px 0; }
        .news-list { display: none; list-style: none; padding: 0; margin: 0; }
        .news-list.active { display: block; }
        .news-item { padding: 12px 15px; border-bottom: 1px solid #f0f0f0; }
        .news-item a { text-decoration: none !important; color: #222 !important; font-size: 14px; display: block; line-height: 1.4; font-weight: 500; }
        .news-item a:hover { color: #bc1d22 !important; }
    `;
    document.head.appendChild(style);

    // २. HTML Structure
    const div = document.createElement('div');
    div.id = 'floating-wrapper';
    div.innerHTML = `
        <div class="tabs-trigger">
            <button class="tab-btn" id="btn-taja">ताजा</button>
            <button class="tab-btn" id="btn-pop">लोकप्रिय</button>
        </div>
        <div id="news-content">
            <div class="content-area">
                <div id="taja-list" class="news-list">लोडिङ...</div>
                <div id="pop-list" class="news-list">लोडिङ...</div>
            </div>
        </div>
    `;
    document.body.appendChild(div);

    const content = document.getElementById('news-content');
    const tajaBtn = document.getElementById('btn-taja');
    const popBtn = document.getElementById('btn-pop');
    const tajaList = document.getElementById('taja-list');
    const popList = document.getElementById('pop-list');

    // ३. Multi-function Logic [cite: 2026-01-07]
    function toggle(type, btn) {
        const isActive = btn.classList.contains('active');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.news-list').forEach(l => l.classList.remove('active'));
        
        if (!isActive) {
            btn.classList.add('active');
            content.classList.add('show');
            (type === 'taja' ? tajaList : popList).classList.add('active');
        } else {
            content.classList.remove('show');
        }
    }

    tajaBtn.onclick = () => toggle('taja', tajaBtn);
    popBtn.onclick = () => toggle('pop', popBtn);

    let tajaTitles = [];
    window.renderTaja = function(d) {
        let h = "";
        (d.feed.entry || []).forEach(e => {
            let t = e.title.$t; tajaTitles.push(t);
            let l = e.link.find(x => x.rel==='alternate').href;
            h += `<div class="news-item"><a href="${l}" target="_parent">${t}</a></div>`;
        });
        tajaList.innerHTML = h || "डाटा भेटिएन";
    };

    window.renderPop = function(d) {
        let h = "", count = 0;
        (d.feed.entry || []).forEach(e => {
            let t = e.title.$t;
            if(!tajaTitles.includes(t) && count < 8) {
                let l = e.link.find(x => x.rel==='alternate').href;
                h += `<div class="news-item"><a href="${l}" target="_parent">${t}</a></div>`;
                count++;
            }
        });
        popList.innerHTML = h || "डाटा भेटिएन";
    };

    // ४. फिड लोडिङ
    const s1 = document.createElement('script');
    s1.src = "https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&max-results=10&callback=renderTaja";
    document.body.appendChild(s1);

    setTimeout(() => {
        const s2 = document.createElement('script');
        s2.src = "https://www.birgunj.eu.org/feeds/posts/default?alt=json-in-script&orderby=updated&max-results=20&callback=renderPop";
        document.body.appendChild(s2);
    }, 1000);
})();