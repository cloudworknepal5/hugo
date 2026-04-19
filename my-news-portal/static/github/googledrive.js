/**
 * Neelamb Universal Gallery Engine v5.0 (Global Search Support)
 */

class NeelambGallery {
    constructor(config) {
        this.containerId = config.containerId;
        this.folderId = config.folderId;
        this.title = config.title || "";
        this.batchSize = config.batchSize || 9;
        this.scriptUrl = "https://script.google.com/macros/s/AKfycbzB6SCAGH8aOweGG6twgctfcyBg48eU-TCgNolqNOoGGp6DiTuBXJ6MjMiLwIVJ8o0U/exec";
        
        this.allFiles = [];
        this.filteredFiles = [];
        this.displayedCount = 0;

        this.injectCSS();
        this.initStructure();
        this.fetchData();
        
        // ग्लोबल सर्च विन्डोमा दर्ता गर्ने
        if (!window.neelambInstances) window.neelambInstances = [];
        window.neelambInstances.push(this);
    }

    injectCSS() {
        if (document.getElementById('neelamb-style')) return;
        const style = document.createElement('style');
        style.id = 'neelamb-style';
        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap');
            .nb-gallery-wrapper { max-width: 1400px; margin: 20px auto; font-family: 'Mukta', sans-serif; padding: 10px; }
            .nb-header { display: flex; align-items: center; text-align: center; margin-bottom: 20px; }
            .nb-header::before, .nb-header::after { content: ''; flex: 1; border-bottom: 2px solid #333; }
            .nb-header span { padding: 0 15px; font-size: 22px; font-weight: bold; color: #000; }
            .nb-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; grid-auto-rows: minmax(240px, auto); grid-gap: 12px; margin-bottom: 12px; }
            .nb-grid .nb-card:first-child { grid-row: span 2; }
            .nb-card { background: #fff; border: 1px solid #333; position: relative; overflow: hidden; height: 100%; transition: 0.2s; }
            .nb-card:hover { transform: scale(1.01); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .nb-thumb { width: 100%; height: 100%; position: relative; min-height: 200px; background: #eee; }
            .nb-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .nb-name { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: #fff; padding: 8px; font-size: 13px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; z-index: 2; }
            .nb-dl { position: absolute; top: 8px; right: 8px; background: #e60000; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 5; border: 2px solid #fff; text-decoration: none; }
            .nb-load-more { display: block; margin: 20px auto; padding: 10px 30px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
            .nb-status { text-align: center; padding: 20px; color: #666; font-weight: bold; }
            @media (max-width: 900px) {
                .nb-grid { grid-template-columns: 1fr 1fr; }
                .nb-grid .nb-card:first-child { grid-column: span 2; }
            }
        `;
        document.head.appendChild(style);
    }

    initStructure() {
        const root = document.getElementById(this.containerId);
        if (!root) return;
        root.innerHTML = `
            <div class="nb-gallery-wrapper">
                ${this.title ? `<div class="nb-header"><span>${this.title}</span></div>` : ''}
                <div class="nb-display-area"></div>
                <div class="nb-status">लोड हुँदैछ...</div>
                <button class="nb-load-more" style="display:none;">थप फाइलहरू</button>
            </div>
        `;
        root.querySelector('.nb-load-more').addEventListener('click', () => this.renderBatch());
    }

    async fetchData() {
        const root = document.getElementById(this.containerId);
        try {
            const response = await fetch(`${this.scriptUrl}?id=${this.folderId}&t=${new Date().getTime()}`);
            const data = await response.json();
            this.allFiles = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.filteredFiles = [...this.allFiles];
            root.querySelector('.nb-status').style.display = 'none';
            this.renderBatch(true);
        } catch (e) {
            root.querySelector('.nb-status').innerHTML = "डाटा पाइएन।";
        }
    }

    renderBatch(isFirst = false) {
        const root = document.getElementById(this.containerId);
        const area = root.querySelector('.nb-display-area');
        if (isFirst) { area.innerHTML = ''; this.displayedCount = 0; }

        const next = this.filteredFiles.slice(this.displayedCount, this.displayedCount + this.batchSize);
        if (next.length > 0) {
            const group = document.createElement('div');
            group.className = 'nb-grid';
            group.innerHTML = next.map(f => `
                <div class="nb-card">
                    <a href="https://drive.google.com/uc?export=download&id=${f.id}" class="nb-dl"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg></a>
                    <a href="${f.url}" target="_blank">
                        <div class="nb-thumb">
                            <img src="https://drive.google.com/thumbnail?id=${f.id}&sz=w800" loading="lazy">
                            <div class="nb-name">${f.name}</div>
                        </div>
                    </a>
                </div>
            `).join('');
            area.appendChild(group);
        }
        this.displayedCount += next.length;
        root.querySelector('.nb-load-more').style.display = (this.displayedCount < this.filteredFiles.length) ? 'block' : 'none';
    }

    // यो फङ्सन बाहिरबाट (Navbar बाट) कल हुन्छ
    applyGlobalSearch(query) {
        this.filteredFiles = this.allFiles.filter(f => f.name.toLowerCase().includes(query.toLowerCase()));
        this.renderBatch(true);
    }
}