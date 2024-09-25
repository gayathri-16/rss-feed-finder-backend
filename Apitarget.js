require('dotenv').config();
const cheerio = require('cheerio');

const apiUrl = process.env.API_URL;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text(); // Use response.text() to get the HTML
  })
  .then(html => {
    const $ = cheerio.load(html); // Load the HTML into cheerio
    const metaTags = [];

    // Select all meta tags
    $('meta').each((index, element) => {
      const name = $(element).attr('name');
      const property = $(element).attr('property');
      const content = $(element).attr('content');

      // Store the meta tag details if it has a name or property
      if (name || property) {
        metaTags.push({ name: name || property, content });
      }
    });

    console.log('Meta Tags:', metaTags);
  })
  .catch(err => {
    console.error('Error fetching data:', err);
  });
