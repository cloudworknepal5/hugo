/**
 * Birgunj Blog - Multi-function PWA Manager
 * Features: Dynamic Manifest, Service Worker, & Auto-Install Prompt
 */
const PWA_MANAGER = {
    deferredPrompt: null,
    settings: {
        name: "Birgunj Blog",
        shortName: "Birgunj",
        themeColor: "#2196f3",
        icon: "https://blogger.googleusercontent.com/img/a/AVvXsEiBnC4hcDiMC18QrERnMrE8HTsMkzJDQqBmgeGvMpw_MA8NcKTPX3jUdY-byqu7K7iXUR9uByo0VBeiYdx5UXPJQHoslvzt6z-EprS-I-bg-L-w9hC_n2AUfIXuq5Nr5R1jZF5txT9r3_g5zq6FE1O8KcpaTVzrrhTWEIFv2PsjwJTSuLyHWRcjtzKRLnI"
    },

    init: function() {
        this.injectMetaAndManifest();
        this.registerSW();
        this.setupInstallLogic();
    },

    // Function 1: Generate Manifest & Meta Tags
    injectMetaAndManifest: function() {
        const manifestData = {
            "name": this.settings.name,
            "short_name": this.settings.shortName,
            "start_url": window.location.origin,
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": this.settings.themeColor,
            "icons": [{
                "src": this.settings.icon,
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any maskable"
            }]
        };
        
        const blob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = URL.createObjectURL(blob);
        document.head.appendChild(manifestLink);

        const appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        appleLink.href = this.settings.icon;
        document.head.appendChild(appleLink);
    },

    // Function 2: Service Worker (Blogger-Compatible Base64)
    registerSW: function() {
        if ('serviceWorker' in navigator) {
            const swCode = 'data:application/javascript;base64,c2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsIGZ1bmN0aW9uKGV2ZW50KSB7IH0pOw==';
            navigator.serviceWorker.register(swCode).then(() => {
                console.log('PWA Status: Service Worker Active');
            });
        }
    },

    // Function 3: UI & Install Logic
    setupInstallLogic: function() {
        const bannerHTML = `
            <div id="pwa-banner">
                <img src="${this.settings.icon}" alt="App Icon"/>
                <div class="info-text">
                    <div class="app-title">${this.settings.name}</div>
                    <div class="app-desc">Install our app for a better experience</div>
                </div>
                <button id="pwa-btn-install">Install</button>
                <button id="pwa-close-btn">&times;</button>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        const banner = document.getElementById('pwa-banner');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (!localStorage.getItem('pwa_dismissed')) {
                setTimeout(() => { banner.style.display = 'flex'; }, 3000);
            }
        });

        document.getElementById('pwa-btn-install').addEventListener('click', async () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                const { outcome } = await this.deferredPrompt.userChoice;
                if (outcome === 'accepted') banner.style.display = 'none';
                this.deferredPrompt = null;
            }
        });

        document.getElementById('pwa-close-btn').addEventListener('click', () => {
            banner.style.display = 'none';
            localStorage.setItem('pwa_dismissed', 'true');
        });
    }
};

// Start PWA Manager
PWA_MANAGER.init();
