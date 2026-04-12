/**
 * Birgunj News - Multi-function Triple-Check Audio
 * Fixed: Browser Audio Block & Voice Engine Delay
 */

window.birgunjStore = { taja: [], pop: [] };

window.renderTaja = (d) => processFeed(d, 'taja');
window.renderPop = (d) => processFeed(d, 'pop');

function processFeed(data, type) {
    const listEl = document.getElementById(type + '-list');
    if (!listEl || !data.feed.entry) return;
    let html = "";
    window.birgunjStore[type] = [];
    data.feed.entry.forEach(e => {
        const title = e.title.$t;
        const link = e.link.find(l => l.rel === 'alternate').href;
        const snippet = e.summary ? e.summary.$t.replace(/<[^>]*>?/gm, '').trim() : "विवरण छैन";
        window.birgunjStore[type].push({ title, snippet });
        html += `<div class="news-item" style="padding:12px; border-bottom:1px solid #eee;">
                    <a href="${link}" target="_blank" style="text-decoration:none; color:#222; font-weight:600; font-size:14px;">${title}</a>
                 </div>`;
    });
    listEl.innerHTML = html;
}

(function() {
    const root = document.getElementById('birgunj-widget-root');
    if (!root) return;

    const style = document.createElement('style');
    style.textContent = `
        #floating-wrapper { position: fixed; top: 150px; right: 12px; z-index: 999999; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; font-family: sans-serif; }
        .tab-btn { width: 50px; height: 50px; background: #bc1d22; border-radius: 50%; border: 2px solid #fff; cursor: pointer; color: white; font-size: 22px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .tab-btn.playing { background: #2ecc71 !important; animation: b-pulse 1s infinite; }
        #news-box { width: 280px; background: white; border-radius: 10px; position: absolute; right: 60px; top: 0; box-shadow: 0 5px 25px rgba(0,0,0,0.2); display: none; overflow: hidden; border: 1px solid #ddd; }
        #news-box.show { display: block; }
        @keyframes b-pulse { 0% { box-shadow: 0 0 0 0 rgba(46,204,113,0.7); } 70% { box-shadow: 0 0 0 10px rgba(46,204,113,0); } 100% { box-shadow: 0 0 0 0 rgba(46,204,113,0); } }
    `;
    document.head.appendChild(style);

    root.innerHTML = `
        <div id="floating-wrapper">
            <button class="tab-btn" onclick="toggleView('taja')" id="t-btn">⚡</button>
            <button class="tab-btn" onclick="toggleView('pop')" id="p-btn">🔥</button>
            <button class="tab-btn" onclick="handleAudio()" id="a-btn">🔊</button>
            <div id="news-box">
                <div id="box-head" style="background:#bc1d22; color:white; padding:10px; text-align:center; font-weight:bold;">बिरगञ्ज न्यूज</div>
                <div id="taja-list" class="news-list" style="display:block; max-height:400px; overflow-y:auto;"></div>
                <div id="pop-list" class="news-list" style="display:none; max-height:400px; overflow-y:auto;"></div>
            </div>
        </div>
    `;

    let synth = window.speechSynthesis;
    let currentType = 'taja';

    // आवाज लोड गर्ने फिक्स
    function loadVoices() { synth.getVoices(); }
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }

    window.handleAudio = () => {
        // १. यदि बजिरहेको छ भने रोक्ने
        if (synth.speaking) {
            synth.cancel();
            updateUI(false);
            return;
        }

        const items = window.birgunjStore[currentType];
        if (!items || items.length === 0) return;

        // २. अडियो अनलक गर्ने (Empty Prompt)
        synth.speak(new SpeechSynthesisUtterance(""));

        updateUI(true);
        let text = "नमस्ते, बिरगञ्ज न्यूज। ";
        items.slice(0, 5).forEach((item, i) => {
            text += `समाचार ${i+1}: ${item.title}. विवरण: ${item.snippet}. `;
        });

        const utter = new SpeechSynthesisUtterance(text);
        const voices = synth.getVoices();
        
        // ३. नेपाली वा हिन्दी आवाज छान्ने
        const nepaliVoice = voices.find(v => v.lang.includes('ne')) || voices.find(v => v.lang.includes('hi'));
        if (nepaliVoice) utter.voice = nepaliVoice;
        
        utter.lang = 'ne-NP';
        utter.rate = 0.8; // अझ स्पष्ट सुनिने गरी सुस्त बनाइएको
        utter.pitch = 1;

        utter.onend = () => updateUI(false);
        utter.onerror = () => updateUI(false);

        // ४. थोरै ढिलो गरी समाचार सुरु गर्ने (Browser Sync Fix)
        setTimeout(() => { synth.speak(utter); }, 200);
    };

    window.toggleView = (type) => {
        currentType = type;
        document.getElementById('news-box').classList.add('show');
        document.getElementById('taja-list').style.display = type === 'taja' ? 'block' : 'none';
        document.getElementById('pop-list').style.display = type === 'pop' ? 'block' : 'none';
        document.getElementById('box-head').innerText = type === 'taja' ? "ताजा समाचार" : "लोकप्रिय समाचार";
    };

    function updateUI(playing) {
        const btn = document.getElementById('a-btn');
        btn.innerText = playing ? "🛑" : "🔊";
        playing ? btn.classList.add('playing') : btn.classList.remove('playing');
    }

    const loadScript = (url) => {
        const s = document.createElement('script');
        s.src = url;
        document.body.appendChild(s);
    };

    loadScript("https://www.birgunj.eu.org/feeds/posts/summary?alt=json-in-script&max-results=6&callback=renderTaja");
    setTimeout(() => loadScript("https://www.birgunj.eu.org/feeds/posts/summary?alt=json-in-script&max-results=6&callback=renderPop"), 1200);
})();