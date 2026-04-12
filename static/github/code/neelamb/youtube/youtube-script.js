// तपाईंको च्यानल ID यहाँ राखिएको छ
const CHANNEL_ID = 'UCtHUM3lIkAraWGIGNzZOOZw'; 
const MAX_VIDEOS = 3; 

async function fetchYouTubeVideos() {
    const feedURL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedURL)}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const container = document.getElementById('youtube-feed');

        if (data.status === 'ok') {
            let htmlContent = '';
            // च्यानलमा भएका भिडियोहरू मध्ये पछिल्ला ३ वटा मात्र लिने
            const items = data.items.slice(0, MAX_VIDEOS);
            
            items.forEach(item => {
                const videoID = item.link.split('v=')[1];
                htmlContent += `
                    <div class="yt-video-item">
                        <iframe src="https://www.youtube.com/embed/${videoID}" 
                                allowfullscreen>
                        </iframe>
                    </div>`;
            });
            container.innerHTML = htmlContent;
        } else {
            container.innerHTML = 'भिडियो लोड गर्न सकिएन।';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('youtube-feed').innerHTML = 'प्राविधिक त्रुटि भयो।';
    }
}

// पेज लोड भएपछि फङ्सन चलाउने
document.addEventListener('DOMContentLoaded', fetchYouTubeVideos);
