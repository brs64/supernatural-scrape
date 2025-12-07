# 🔍 Guide du Scraping

Guide pour tester et configurer le scraping des conventions Supernatural.

## 🚀 Tester le scraping en local

### Commande rapide

```bash
npm run scrape
```

Cette commande :
1. Installe les dépendances du scraper (axios, cheerio)
2. Exécute le scraping sur tous les sites configurés
3. Génère/met à jour `data/conventions.json`

### Voir les résultats détaillés

```bash
npm run scrape:test
```

Affiche le JSON complet après le scraping.

## 📊 Résultat attendu

Lors de l'exécution, vous verrez :

```
🔥 Supernatural Conventions Scraper 🔥

Starting scraping process...

🔍 Scraping Creation Entertainment...
✅ Found X conventions from Creation Entertainment

🔍 Scraping Starfury Conventions...
✅ Starfury: X total conventions

🔍 Scraping HonCon...
✅ HonCon: X total conventions

🔍 Searching Eventbrite...
✅ Eventbrite: X total conventions

🔍 Scraping People Conventions...
✅ People Conventions: X total conventions

✅ Saved X conventions to data/conventions.json

🎉 Scraping completed!
📊 Total conventions found: X
```

## ⚠️ Erreurs courantes

### Erreur 404 ou ENOTFOUND

```
❌ Error scraping [Site]: Request failed with status code 404
❌ Error scraping [Site]: getaddrinfo ENOTFOUND www.example.com
```

**Causes :**
- Le site a changé d'URL
- Le site bloque les scrapers
- Le site n'existe plus
- Protection anti-bot

**Solutions :**
1. Vérifier que l'URL existe dans un navigateur
2. Adapter les sélecteurs CSS dans `scraper/scrape.js`
3. Ajouter des headers plus réalistes
4. Utiliser les conventions manuelles (voir ci-dessous)

### Erreur 405 (Method Not Allowed)

```
❌ Error scraping Eventbrite: Request failed with status code 405
```

Le site bloque les requêtes GET simples. Il faut :
- Utiliser un vrai navigateur (Puppeteer)
- Ou ajouter les conventions manuellement

## ✍️ Ajouter des conventions manuellement

Éditer `scraper/scrape.js`, fonction `addManualConventions()` :

```javascript
function addManualConventions() {
  const manualConventions = [
    {
      id: 'unique-id-2025',                    // ID unique (slug)
      name: 'Nom de la Convention',            // Nom complet
      location: 'Ville, Pays',                 // Lieu
      date: 'Mois JJ-JJ, YYYY',               // Date formatée
      url: 'https://site.com',                 // URL de la convention
      source: 'Manual Entry',                  // Source (ne pas changer)
      guests: ['Acteur 1', 'Acteur 2']        // Liste des invités
    },
    // Ajouter d'autres conventions ici...
  ];

  conventions.push(...manualConventions);
}
```

**Exemple réel :**

```javascript
{
  id: 'honcon-2025-germany',
  name: 'HonCon 2025',
  location: 'Düsseldorf, Germany',
  date: 'June 20-22, 2025',
  url: 'https://www.honcon.de',
  source: 'Manual Entry',
  guests: ['Jensen Ackles', 'Jared Padalecki', 'Misha Collins']
}
```

Après modification, relancer :

```bash
npm run scrape
```

## 🛠️ Améliorer le scraping

### 1. Adapter les sélecteurs CSS

Chaque site a une structure HTML différente. Pour adapter :

1. Ouvrir le site dans le navigateur
2. **F12** → Inspecteur
3. Trouver les éléments contenant les conventions
4. Noter les classes CSS et balises
5. Modifier dans `scraper/scrape.js`

**Exemple :**

```javascript
async function scrapeMonSite() {
  try {
    const response = await axios.get('https://monsite.com/events');
    const $ = cheerio.load(response.data);

    // Adapter ces sélecteurs selon le site
    $('.event-card').each((i, elem) => {
      const name = $(elem).find('.event-title').text().trim();
      const location = $(elem).find('.event-location').text().trim();
      const date = $(elem).find('.event-date').text().trim();
      const url = $(elem).find('a').attr('href');

      // Filtrer Supernatural
      if (name.toLowerCase().includes('supernatural')) {
        conventions.push({
          id: generateId(name, date),
          name,
          location,
          date,
          url: url.startsWith('http') ? url : `https://monsite.com${url}`,
          source: 'Mon Site',
          guests: []
        });
      }
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}
```

### 2. Ajouter des headers réalistes

Certains sites bloquent les bots. Ajouter :

```javascript
const response = await axios.get(url, {
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://www.google.com/'
  }
});
```

### 3. Utiliser Puppeteer pour les sites JavaScript

Pour les sites qui nécessitent JavaScript (comme Eventbrite) :

```bash
cd scraper
npm install puppeteer
```

```javascript
const puppeteer = require('puppeteer');

async function scrapeWithBrowser() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://site.com');

  const content = await page.content();
  const $ = cheerio.load(content);

  // Scraper normalement avec cheerio

  await browser.close();
}
```

## 📝 Fichier de sortie

Le scraper génère `data/conventions.json` avec ce format :

```json
{
  "lastUpdate": "2025-12-07T16:00:00.000Z",
  "count": 3,
  "conventions": [
    {
      "id": "convention-id",
      "name": "Nom de la Convention",
      "location": "Ville, Pays",
      "date": "Mois JJ-JJ, YYYY",
      "url": "https://...",
      "source": "Source Name",
      "guests": ["Guest 1", "Guest 2"]
    }
  ]
}
```

## 🔄 Workflow de développement

1. **Modifier le scraper** dans `scraper/scrape.js`
2. **Tester localement** : `npm run scrape`
3. **Vérifier les résultats** : `cat data/conventions.json`
4. **Relancer l'app** : dans Expo, tirer pour rafraîchir
5. **Commiter** : les conventions apparaîtront dans l'app

## 🚀 Déploiement

Une fois que le scraper fonctionne localement :

```bash
git add .
git commit -m "Update scraper and conventions data"
git push
```

GitHub Actions exécutera le scraper automatiquement toutes les heures.

## 💡 Conseils

1. **Commencer par les conventions manuelles** - Plus fiable
2. **Tester un site à la fois** - Plus facile à débugger
3. **Regarder les logs** - Les erreurs donnent des indices
4. **Être patient avec le scraping** - Les sites changent souvent
5. **Respecter les robots.txt** - Certains sites l'interdisent

## 📞 Besoin d'aide ?

Si le scraping ne fonctionne pas :
1. Consulter `TROUBLESHOOTING.md`
2. Vérifier les logs du scraper
3. Utiliser les conventions manuelles en attendant

---

**Happy scraping! 🔥**
