/**
 * Name: Post Page Template JS
 * Feature: Multi-function Social Share & Dynamic Meta
 */

document.addEventListener("DOMContentLoaded", function() {
    const currentUrl = window.location.href;
    const currentTitle = document.title;

    // Social Share Functionality
    const selectors = {
        fb: document.querySelector('.share-fb'),
        tw: document.querySelector('.share-tw'),
        wa: document.querySelector('.share-wa')
    };

    if (selectors.fb) {
        selectors.fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    }

    if (selectors.tw) {
        selectors.tw.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentTitle)}&url=${encodeURIComponent(currentUrl)}`;
    }

    if (selectors.wa) {
        selectors.wa.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentTitle + " " + currentUrl)}`;
    }

    console.log("PostPageTemplate Multi-function JS Loaded Successfully.");
});
