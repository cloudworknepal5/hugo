/**
 * Auto-Location Weather Widget (25x50)
 * Detects user location automatically.
 */

const WeatherWidget = {
    // 1. Inject UI Styles
    injectStyles: function() {
        const css = `
            #weather-widget {
                width: 50px; height: 25px;
                background: #111; color: #fff;
                border-radius: 4px; display: flex; align-items: center;
                font-family: sans-serif; overflow: hidden;
                border: 1px solid #333; box-sizing: border-box;
            }
            #weather-icon-box { width: 18px; display: flex; align-items: center; }
            #weather-icon-box img { width: 22px; height: 22px; }
            #weather-info { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-left: 1px; }
            #weather-temp { font-size: 10px; font-weight: bold; color: #ff5722; line-height: 0.8; }
            #weather-loc { font-size: 7px; opacity: 0.7; white-space: nowrap; line-height: 1.2; }
        `;
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    },

    // 2. Main Logic: Detect Location or Fallback
    initLocation: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    // Fetch weather using coordinates
                    this.fetchData(pos.coords.latitude, pos.coords.longitude);
                },
                (err) => {
                    // Fallback to default city if user denies location access
                    console.warn("Location denied, using default.");
                    this.fetchDataByCity("Birgunj");
                }
            );
        } else {
            this.fetchDataByCity("Birgunj");
        }
    },

    // 3. Fetch by Coordinates
    fetchData: async function(lat, lon) {
        const apiKey = "9c17c4095ee2a4042c26bbd4d4de1726";
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        this.executeFetch(url);
    },

    // 4. Fetch by City (Fallback)
    fetchDataByCity: async function(city) {
        const apiKey = "9c17c4095ee2a4042c26bbd4d4de1726";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        this.executeFetch(url);
    },

    // 5. Shared Fetch Execution
    executeFetch: async function(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            this.updateUI(data);
        } catch (e) {
            document.getElementById('weather-loc').innerText = "Offline";
        }
    },

    // 6. Update HTML
    updateUI: function(data) {
        const icon = data.weather[0].icon;
        document.getElementById('weather-icon-box').innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png">`;
        document.getElementById('weather-temp').innerText = Math.round(data.main.temp) + "°";
        document.getElementById('weather-loc').innerText = data.name.substring(0, 8);
        document.getElementById('weather-widget').title = `${data.name}: ${data.weather[0].description}`;
    },

    // Initialize all functions
    init: function() {
        this.injectStyles();
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.initLocation());
        } else {
            this.initLocation();
        }
    }
};

WeatherWidget.init();
