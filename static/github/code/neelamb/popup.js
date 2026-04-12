(function() {
    // 1. Inject Responsive CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #popup-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 999999; visibility: hidden; opacity: 0;
            transition: all 0.3s ease-in-out;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #popup-overlay.popup-visible { visibility: visible; opacity: 1; }
        
        #popup-content {
            background: #fff; border-radius: 12px; overflow: hidden;
            width: 90%; max-width: 400px; position: relative;
            transform: scale(0.8); transition: transform 0.3s ease;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        #popup-overlay.popup-visible #popup-content { transform: scale(1); }
        
        #popup-img { width: 100%; height: auto; display: block; object-fit: cover; }
        
        .popup-body { padding: 20px; text-align: center; }
        .popup-body h2 { margin: 0 0 10px; font-size: 22px; color: #333; }
        .popup-body p { margin: 0 0 20px; font-size: 15px; color: #666; line-height: 1.4; }
        
        #close-popup {
            position: absolute; top: 10px; right: 10px; 
            background: #fff; border: none; font-size: 24px; font-weight: bold;
            cursor: pointer; border-radius: 50%; width: 35px; height: 35px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 100;
        }
        
        .popup-button {
            display: block; padding: 12px; background: #00b894; color: #fff;
            text-decoration: none; border-radius: 8px; font-weight: bold;
            transition: background 0.2s;
        }
        .popup-button:hover { background: #00947a; }

        /* Mobile Specific Adjustments */
        @media (max-width: 480px) {
            #popup-content { width: 85%; }
            .popup-body h2 { font-size: 18px; }
            .popup-body p { font-size: 13px; }
            #close-popup { width: 30px; height: 30px; font-size: 20px; }
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const popupHTML = `
        <div id="popup-overlay">
            <div id="popup-content">
                <button id="close-popup" aria-label="Close">&times;</button>
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_JemdYPuBJwS0-mxOOevsLZTuVMi1xBLgNFwhc_Mcd7Pe9PT-fjrEwUh1CPxUSQAJhOyatOypIFAYw6x3Rs7QyVcQ8BMCh_RJmv6xBySeHHQ1UDEik2yuBSAFc9A-_BMiwGVgYtb5NXq-z1QU8Wo5Xx0s-maYc7QzGLHeSni4wXSIiXFvaFRiWxTftWQ/s1000/new%20year-2026%20offer%20copy.png" alt="Promo" id="popup-img">
                <div class="popup-body">
                    <h2>New Year-2026 Offer!</h2>
                    <p>Create Dynamic News Portal Just Nrs 5,000.</p>
                    <a href="https://neelamb.com" class="popup-button">Get Now</a>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 3. Logic: Show every time on load
    const overlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('close-popup');

    // Slight delay so the page loads first
    setTimeout(() => {
        overlay.classList.add('popup-visible');
    }, 1500);

    // Close logic
    closeBtn.onclick = () => overlay.classList.remove('popup-visible');
    overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove('popup-visible'); };
})();


