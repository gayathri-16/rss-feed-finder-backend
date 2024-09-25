require('dotenv').config();
const cheerio = require('cheerio');

const categories = {
    "E-Commerce": ['shopping', 'online shopping', 'online', 'buy', 'e-commerce', 'store', 'product', 'sale'],
    "Education": ['learning', 'education', 'university', 'course', 'study', 'e-learning', 'online courses', 'degrees', 'certificate programs', 'skills', 'ai', 'ml', 'data science', 'cloud computing', 'pg programs', 'digital marketing'],
    "Technology": ['technology', 'tech', 'gadgets', 'innovation', 'software', 'hardware'],
    "Social Media": ['social media', 'community', 'network', 'platform', 'interaction'],
    "Blog": ['blog', 'personal', 'lifestyle', 'diary', 'content'],
    "Food & Beverages": ['ice cream', 'food', 'restaurant', 'cafe', 'dessert', 'menu'],
    "Entertainment": ['online games', 'fun', 'entertainment', 'games', 'fun and time', 'sports', 'fun websites']
};

const exactWordMatch = (metaContent, keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(metaContent);
};

const categorizeWebsite = (metaTags) => {
    const metaContent = metaTags.map(tag => tag.content.toLowerCase()).join(' ');

    // Score categories based on the number of keyword matches
    const categoryScores = {};
    for (const [category, keywords] of Object.entries(categories)) {
        categoryScores[category] = 0; // Initialize score

        // Check for exact matches of keywords
        keywords.forEach((keyword) => {
            if (exactWordMatch(metaContent, keyword)) {
                categoryScores[category] += 1; // Increment score for each match
            }
        });
    }

    // Find the category with the highest score
    const bestCategory = Object.entries(categoryScores).reduce((a, b) => a[1] > b[1] ? a : b);
    
    return bestCategory[1] > 0 ? bestCategory[0] : "Unknown"; // Return category with highest score or "Unknown"
};

const extractThumbnail = ($) => {
    // Look for Open Graph or Twitter Card image meta tags
    const ogImage = $('meta[property="og:image"]').attr('content');
    const twitterImage = $('meta[name="twitter:image"]').attr('content');

    // Return the first valid image URL found
    if (ogImage) {
        return ogImage;
    } else if (twitterImage) {
        return twitterImage;
    }

    // If no meta tags are found, return the first large image from the page (as fallback)
    const firstImage = $('img').first().attr('src');
    return firstImage || null;  // Return null if no image is found
};

exports.fetchAndCategorize = async (req, res) => {
    try {
        const { url } = req.body;
        console.log('Received URL:', url); // Log the received URL

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch the webpage: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const metaTags = [];

        $('meta').each((index, element) => {
            const name = $(element).attr('name');
            const property = $(element).attr('property');
            const content = $(element).attr('content');
            if (content) {
                metaTags.push({ name: name || property, content });
            }
        });

        const category = categorizeWebsite(metaTags);
        const thumbnail = extractThumbnail($);

        res.json({
            url,
            category,
            thumbnail: thumbnail || "No thumbnail found"
        });
    } catch (err) {
        console.error('Error:', err.message); // Log the error
        res.status(500).json({ error: err.message });
    }
};

