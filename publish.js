const axios = require('axios');
const fs = require('fs');

// config - आफ्नो विवरण यहाँ भर्नुहोस्
const API_URL = 'https://your-worker-url.workers.dev/api/news/add';
const DEPLOY_HOOK = 'https://api.cloudflare.com/client/v4/pages/namespaces/your-id/deploy_hooks/your-id';

async function publish() {
    try {
        // news.txt बाट समाचार पढ्ने
        const rawContent = fs.readFileSync('news.txt', 'utf8');
        const lines = rawContent.split('\n');
        
        const title = lines[0].replace('Title:', '').trim();
        const content = lines.slice(1).join('\n').trim();

        const newsData = {
            title: title,
            content: content,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            category: "General",
            thumbnail: "img/dicap.jpg" // तपाईंको मिडिया लाइब्रेरीको फोटो
        };

        console.log("⏳ समाचार पठाउँदै: " + title);

        // १. D1 मा समाचार पठाउने
        const res = await axios.post(API_URL, newsData);
        console.log("✅ D1 मा सेभ भयो!");

        // २. Cloudflare Build सुरु गर्ने
        await axios.post(DEPLOY_HOOK);
        console.log("🚀 Cloudflare Build सुरु भयो। २ मिनेटमा समाचार लाइभ हुनेछ।");

    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error("❌ 'news.txt' फाइल फेला परेन। कृपया समाचार लेखेर सेभ गर्नुहोस्।");
        } else {
            console.error("❌ एरर आयो:", err.message);
        }
    }
}

publish();