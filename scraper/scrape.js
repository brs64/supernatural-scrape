import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des conventions (sera enrichie par le scraping)
let conventions = [];

/**
 * Génère un ID unique basé sur le nom et la date
 */
function generateId(name, date) {
  const str = `${name}-${date}`.toLowerCase().replace(/\s+/g, '-');
  return str.replace(/[^a-z0-9-]/g, '');
}

/**
 * Scraper pour Creation Entertainment
 * https://www.creationent.com
 */
async function scrapeCreationEntertainment() {
  try {
    console.log('🔍 Scraping Creation Entertainment...');
    const response = await axios.get('https://www.creationent.com/cal.html', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Chercher les conventions Supernatural en Europe
    // ATTENTION: Le site peut changer, ce code devra être adapté
    $('.event-item, .convention-item').each((i, elem) => {
      const text = $(elem).text();

      // Filtrer les conventions Supernatural en Europe
      if (text.toLowerCase().includes('supernatural') &&
          (text.match(/europe|uk|france|germany|italy|spain|belgium|netherlands/i))) {

        const name = $(elem).find('.event-name, h3, h4').first().text().trim() || 'Supernatural Convention';
        const location = extractLocation(text);
        const date = extractDate(text);
        const url = $(elem).find('a').attr('href') || 'https://www.creationent.com';

        if (date) {
          conventions.push({
            id: generateId(name, date),
            name,
            location: location || 'Europe',
            date,
            url: url.startsWith('http') ? url : `https://www.creationent.com${url}`,
            source: 'Creation Entertainment',
            guests: []
          });
        }
      }
    });

    console.log(`✅ Found ${conventions.length} conventions from Creation Entertainment`);
  } catch (error) {
    console.error('❌ Error scraping Creation Entertainment:', error.message);
  }
}

/**
 * Scraper pour Starfury Conventions (UK)
 * https://www.starfuryconventions.com
 */
async function scrapeStarfury() {
  try {
    console.log('🔍 Scraping Starfury Conventions...');
    const response = await axios.get('https://www.starfuryconventions.com', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Chercher les événements Supernatural
    $('article, .event, .convention-listing').each((i, elem) => {
      const text = $(elem).text();

      if (text.toLowerCase().includes('supernatural')) {
        const name = $(elem).find('h2, h3, .title').first().text().trim() || 'Supernatural Convention';
        const location = extractLocation(text) || 'United Kingdom';
        const date = extractDate(text);
        const url = $(elem).find('a').attr('href') || 'https://www.starfuryconventions.com';

        if (date) {
          conventions.push({
            id: generateId(name, date),
            name,
            location,
            date,
            url: url.startsWith('http') ? url : `https://www.starfuryconventions.com${url}`,
            source: 'Starfury Conventions',
            guests: []
          });
        }
      }
    });

    console.log(`✅ Starfury: ${conventions.length} total conventions`);
  } catch (error) {
    console.error('❌ Error scraping Starfury:', error.message);
  }
}

/**
 * Scraper pour HonCon (Allemagne)
 */
async function scrapeHonCon() {
  try {
    console.log('🔍 Scraping HonCon...');
    // HonCon est spécialisé dans Supernatural
    const response = await axios.get('https://www.honcon.de', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    $('.event, .convention, article').each((i, elem) => {
      const name = $(elem).find('h1, h2, h3, .title').first().text().trim() || 'HonCon Supernatural Convention';
      const location = extractLocation($(elem).text()) || 'Germany';
      const date = extractDate($(elem).text());
      const url = $(elem).find('a').attr('href') || 'https://www.honcon.de';

      if (date) {
        conventions.push({
          id: generateId(name, date),
          name,
          location,
          date,
          url: url.startsWith('http') ? url : `https://www.honcon.de${url}`,
          source: 'HonCon',
          guests: []
        });
      }
    });

    console.log(`✅ HonCon: ${conventions.length} total conventions`);
  } catch (error) {
    console.error('❌ Error scraping HonCon:', error.message);
  }
}

/**
 * Recherche Eventbrite pour des conventions Supernatural en Europe
 */
async function scrapeEventbrite() {
  try {
    console.log('🔍 Searching Eventbrite...');
    const searchUrl = 'https://www.eventbrite.com/d/europe/supernatural-convention/';

    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    $('.search-event-card, .event-card').each((i, elem) => {
      const name = $(elem).find('h3, .event-card__title').text().trim();
      const location = $(elem).find('.event-card__location, .location').text().trim();
      const date = $(elem).find('.event-card__date, .date').text().trim();
      const url = $(elem).find('a').attr('href');

      if (name && date) {
        conventions.push({
          id: generateId(name, date),
          name,
          location: location || 'Europe',
          date,
          url: url || searchUrl,
          source: 'Eventbrite',
          guests: []
        });
      }
    });

    console.log(`✅ Eventbrite: ${conventions.length} total conventions`);
  } catch (error) {
    console.error('❌ Error scraping Eventbrite:', error.message);
  }
}

/**
 * Extrait une localisation du texte
 */
function extractLocation(text) {
  const locations = {
    'london': 'London, UK',
    'paris': 'Paris, France',
    'berlin': 'Berlin, Germany',
    'rome': 'Rome, Italy',
    'madrid': 'Madrid, Spain',
    'amsterdam': 'Amsterdam, Netherlands',
    'brussels': 'Brussels, Belgium',
    'birmingham': 'Birmingham, UK',
    'manchester': 'Manchester, UK',
    'düsseldorf': 'Düsseldorf, Germany',
    'dusseldorf': 'Düsseldorf, Germany',
    'munich': 'Munich, Germany',
    'barcelona': 'Barcelona, Spain',
  };

  const lowerText = text.toLowerCase();
  for (const [key, value] of Object.entries(locations)) {
    if (lowerText.includes(key)) {
      return value;
    }
  }

  return null;
}

/**
 * Extrait une date du texte
 */
function extractDate(text) {
  // Chercher différents formats de date
  const patterns = [
    /(\d{1,2}[\s-]+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s-]+\d{4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
    /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s]+\d{1,2}[\s,]+\d{4})/i,
    /(\d{4}[\s-]+\d{1,2}[\s-]+\d{1,2})/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Ajoute des conventions manuelles (sources fiables connues)
 */
function addManualConventions() {
  // Ces conventions peuvent être ajoutées manuellement si connues
  // Exemple: conventions annoncées sur les réseaux sociaux officiels
  const manualConventions = [
    // Exemple - à compléter avec de vraies données
    // {
    //   id: 'honcon-2025-dusseldorf',
    //   name: 'HonCon 2025',
    //   location: 'Düsseldorf, Germany',
    //   date: 'June 2025',
    //   url: 'https://www.honcon.de',
    //   source: 'Manual Entry',
    //   guests: ['TBA']
    // }
  ];

  conventions.push(...manualConventions);
}

/**
 * Supprime les doublons basés sur l'ID
 */
function removeDuplicates() {
  const seen = new Set();
  conventions = conventions.filter(conv => {
    if (seen.has(conv.id)) {
      return false;
    }
    seen.add(conv.id);
    return true;
  });
}

/**
 * Trie les conventions par date (les plus proches en premier)
 */
function sortConventions() {
  conventions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;

    return dateA - dateB;
  });
}

/**
 * Sauvegarde les résultats dans un fichier JSON
 */
async function saveResults() {
  const outputPath = path.join(__dirname, '..', 'data', 'conventions.json');

  const output = {
    lastUpdate: new Date().toISOString(),
    count: conventions.length,
    conventions: conventions
  };

  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`\n✅ Saved ${conventions.length} conventions to ${outputPath}`);
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🔥 Supernatural Conventions Scraper 🔥\n');
  console.log('Starting scraping process...\n');

  // Scrape tous les sites
  await scrapeCreationEntertainment();
  await scrapeStarfury();
  await scrapeHonCon();
  await scrapeEventbrite();

  // Ajouter les conventions manuelles
  addManualConventions();

  // Nettoyer les résultats
  removeDuplicates();
  sortConventions();

  // Sauvegarder
  await saveResults();

  console.log('\n🎉 Scraping completed!');
  console.log(`📊 Total conventions found: ${conventions.length}`);
}

// Exécuter
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
