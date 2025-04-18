const API_HOST = "nba-latest-news.p.rapidapi.com";
const API_KEY = "fb5b97e76cmsh38082f281eee200p1b934djsn5c328e81464b";
const CACHE_EXPIRY = 4 * 24 * 60 * 60 * 1000; // refreshas efter 4 dagar

/**
 * hämtar det senaste nyheterna från ett api.
 * cachen ovanför sparar nyheterna i localStorage i 4 dagar för att undvika onödiga api-requests.
 *
 * @param {number} [limit=10] - gör så att det bara hämtas 10 nyhetsartiklar ifrån api'et.
 * @returns {Promise<Array>} en promise som innhåller en lista med nyhetsartiklar
 */
export const fetchNews = async (limit = 20) => {
    const url = `https://${API_HOST}/articles?limit=${limit}`;
    console.log(`Fetching: ${url}`);

    const cacheKey = `cache_news_${limit}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
            console.log(`Using cached news data`);
            return Array.isArray(data) ? data : [];
        }
    }

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Full API Response:", data);

        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
};