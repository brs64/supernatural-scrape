# 🔍 Comment fonctionne le Scraping ?

Guide complet pour comprendre le fonctionnement du scraping dans l'app Supernatural.

## 📚 Concept général

Le **web scraping** est une technique qui permet d'extraire automatiquement des données depuis des pages web. C'est comme si un robot visitait un site web, lisait son contenu HTML et en extrayait les informations pertinentes.

### Analogie simple

Imaginez que vous visitez manuellement le site HonCon pour voir s'il y a de nouvelles conventions :
1. Vous ouvrez votre navigateur
2. Vous allez sur www.honcon.de
3. Vous lisez la page
4. Vous notez : nom, date, lieu, invités
5. Vous répétez pour chaque site

Le scraper fait **exactement la même chose**, mais automatiquement et en quelques secondes !

---

## 🛠️ Technologies utilisées

### 1. **Axios** - Le navigateur automatique

```javascript
import axios from 'axios';

const response = await axios.get('https://www.honcon.de');
// response.data contient le HTML de la page
```

**Rôle :** Télécharge le contenu HTML d'une page web, comme si vous ouvriez la page dans Chrome.

### 2. **Cheerio** - Le lecteur de HTML

```javascript
import * as cheerio from 'cheerio';

const $ = cheerio.load(response.data);
// $ est comme jQuery, permet de chercher dans le HTML
```

**Rôle :** Parse (analyse) le HTML et permet de chercher des éléments avec des sélecteurs CSS (comme `$('.event-card')`).

---

## 🔄 Processus étape par étape

### Étape 1️⃣ : Télécharger la page web

```javascript
const response = await axios.get('https://www.honcon.de', {
  timeout: 10000,  // Attendre max 10 secondes
  headers: {
    // Se faire passer pour un vrai navigateur
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});
```

**Résultat :** `response.data` contient tout le HTML de la page

**Exemple de HTML reçu :**
```html
<!DOCTYPE html>
<html>
  <body>
    <div class="event">
      <h2>HonCon 2025</h2>
      <p class="location">Düsseldorf, Germany</p>
      <p class="date">June 20-22, 2025</p>
      <a href="/tickets">Acheter</a>
    </div>
  </body>
</html>
```

---

### Étape 2️⃣ : Parser le HTML avec Cheerio

```javascript
const $ = cheerio.load(response.data);
```

**Rôle :** Transforme le HTML en structure manipulable (DOM)

Maintenant on peut chercher des éléments comme avec jQuery :
- `$('.event')` → tous les éléments avec la classe "event"
- `$('h2')` → tous les titres h2
- `$('a').attr('href')` → récupérer l'attribut href d'un lien

---

### Étape 3️⃣ : Chercher les conventions

```javascript
// Parcourir tous les éléments qui ont la classe "event"
$('.event').each((index, element) => {
  // Pour chaque élément, extraire les infos
  const name = $(element).find('h2').text().trim();
  const location = $(element).find('.location').text().trim();
  const date = $(element).find('.date').text().trim();
  const url = $(element).find('a').attr('href');

  console.log(`Trouvé: ${name} à ${location}`);
});
```

**Analogie :** C'est comme utiliser Ctrl+F pour chercher "Supernatural" sur la page, puis noter toutes les informations autour.

---

### Étape 4️⃣ : Filtrer et extraire les données

```javascript
$('.event').each((i, elem) => {
  const text = $(elem).text();  // Tout le texte de l'élément

  // FILTRER : Ne garder que les conventions Supernatural
  if (text.toLowerCase().includes('supernatural')) {

    // EXTRAIRE les informations
    const name = $(elem).find('h2').text().trim();
    const location = extractLocation(text);  // Fonction helper
    const date = extractDate(text);          // Fonction helper
    const url = $(elem).find('a').attr('href');

    // CRÉER un objet convention
    conventions.push({
      id: generateId(name, date),
      name: name,
      location: location || 'Europe',
      date: date,
      url: url,
      source: 'HonCon',
      guests: []
    });
  }
});
```

---

### Étape 5️⃣ : Extraire des infos spécifiques (dates, lieux)

Notre scraper utilise des **expressions régulières** (regex) pour trouver des patterns :

#### Extraction de dates

```javascript
function extractDate(text) {
  // Chercher différents formats de date
  const patterns = [
    // "15 June 2025" ou "June 15, 2025"
    /(\d{1,2}[\s-]+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s-]+\d{4})/i,

    // "15/06/2025" ou "15-06-2025"
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,

    // "2025-06-15" (format ISO)
    /(\d{4}[\s-]+\d{1,2}[\s-]+\d{1,2})/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();  // Retourne la date trouvée
    }
  }

  return null;  // Pas de date trouvée
}
```

**Exemple :**
- Texte : "La convention aura lieu le 15 June 2025 à Paris"
- Résultat : "15 June 2025"

#### Extraction de lieux

```javascript
function extractLocation(text) {
  const locations = {
    'london': 'London, UK',
    'paris': 'Paris, France',
    'berlin': 'Berlin, Germany',
    // ... etc
  };

  const lowerText = text.toLowerCase();

  // Chercher si un nom de ville est mentionné
  for (const [key, value] of Object.entries(locations)) {
    if (lowerText.includes(key)) {
      return value;
    }
  }

  return null;
}
```

**Exemple :**
- Texte : "Convention at the London Hilton"
- Résultat : "London, UK"

---

### Étape 6️⃣ : Sauvegarder en JSON

```javascript
async function saveResults() {
  const output = {
    lastUpdate: new Date().toISOString(),
    count: conventions.length,
    conventions: conventions
  };

  await fs.writeFile(
    'data/conventions.json',
    JSON.stringify(output, null, 2),
    'utf-8'
  );
}
```

Crée le fichier `data/conventions.json` :

```json
{
  "lastUpdate": "2025-12-07T16:00:00.000Z",
  "count": 3,
  "conventions": [
    {
      "id": "honcon-2025-germany",
      "name": "HonCon 2025",
      "location": "Düsseldorf, Germany",
      "date": "June 20-22, 2025",
      "url": "https://www.honcon.de",
      "source": "HonCon",
      "guests": ["Jensen Ackles"]
    }
  ]
}
```

---

## 🎯 Exemple complet en action

Imaginons qu'on scrape cette page HTML :

```html
<html>
  <body>
    <div class="event">
      <h2>HonCon 2025 - Supernatural Convention</h2>
      <p>Düsseldorf, Germany</p>
      <p>June 20-22, 2025</p>
      <a href="/honcon-2025">Plus d'infos</a>
    </div>

    <div class="event">
      <h2>Comic Con Paris</h2>
      <p>Paris, France</p>
      <p>July 2025</p>
    </div>
  </body>
</html>
```

### Processus :

1. **Téléchargement** : Axios récupère ce HTML
2. **Parsing** : Cheerio analyse le HTML
3. **Recherche** : `$('.event')` trouve les 2 divs
4. **Filtrage** :
   - 1er div contient "Supernatural" ✅ → On garde
   - 2ème div ne contient pas "Supernatural" ❌ → On ignore
5. **Extraction** :
   ```javascript
   name: "HonCon 2025 - Supernatural Convention"
   location: "Düsseldorf, Germany"  // extractLocation() trouve "düsseldorf"
   date: "June 20-22, 2025"         // extractDate() trouve le pattern
   url: "https://www.honcon.de/honcon-2025"
   ```
6. **Sauvegarde** : Écrit dans `data/conventions.json`

---

## 🔄 Flux complet dans l'app

```
┌─────────────────────────────────────────────┐
│  1. GitHub Actions (toutes les heures)     │
│     OU                                      │
│     npm run scrape (en local)               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  2. Scraper (scraper/scrape.js)            │
│     • Visite chaque site web               │
│     • Télécharge le HTML                   │
│     • Parse avec Cheerio                   │
│     • Extrait les conventions              │
│     • Filtre "Supernatural" + "Europe"     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  3. Génère data/conventions.json           │
│     {                                       │
│       "count": 3,                           │
│       "conventions": [...]                  │
│     }                                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  4. GitHub Actions commit & push           │
│     (si changements détectés)               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  5. App Mobile (React Native)              │
│     • Télécharge conventions.json          │
│     • Affiche les conventions              │
│     • Envoie notifications si nouvelles    │
└─────────────────────────────────────────────┘
```

---

## ⚠️ Limitations et défis

### 1. **Structure HTML changeante**

Les sites web changent régulièrement leur code HTML.

**Avant :**
```html
<div class="event">
  <h2>HonCon 2025</h2>
</div>
```

**Après mise à jour du site :**
```html
<article class="convention-card">
  <h3>HonCon 2025</h3>
</article>
```

Notre scraper ne trouve plus rien car il cherche `.event` et `h2` ! 💥

**Solution :** Adapter les sélecteurs CSS régulièrement.

### 2. **Protection anti-bot**

Certains sites détectent et bloquent les scrapers :
- Vérification du User-Agent
- CAPTCHA
- Rate limiting (limiter le nombre de requêtes)
- JavaScript obligatoire

**Solution :**
- Headers plus réalistes
- Puppeteer (vrai navigateur)
- Ou conventions manuelles

### 3. **Sites avec JavaScript**

Certains sites (comme Eventbrite) chargent les données avec JavaScript après le chargement de la page.

**Problème :** Axios ne récupère que le HTML initial, pas ce qui est chargé après.

**Solution :** Utiliser Puppeteer qui simule un vrai navigateur.

---

## 💡 Pourquoi les conventions manuelles ?

Pour contourner ces problèmes, on a ajouté `addManualConventions()` :

```javascript
function addManualConventions() {
  const manualConventions = [
    {
      id: 'honcon-2025-germany',
      name: 'HonCon 2025',
      location: 'Düsseldorf, Germany',
      date: 'June 20-22, 2025',
      url: 'https://www.honcon.de',
      source: 'Manual Entry',
      guests: ['Jensen Ackles', 'Jared Padalecki']
    }
  ];

  conventions.push(...manualConventions);
}
```

**Avantages :**
- ✅ Fiable à 100%
- ✅ Pas de problème de scraping
- ✅ Contrôle total sur les données
- ✅ Facile à maintenir

**Inconvénient :**
- ❌ Nécessite mise à jour manuelle

---

## 🎓 Résumé simplifié

1. **Axios** télécharge le HTML d'un site (comme un navigateur)
2. **Cheerio** lit et analyse ce HTML (comme jQuery)
3. On **cherche** les éléments qui nous intéressent (`.event`, `h2`, etc.)
4. On **filtre** pour garder seulement Supernatural
5. On **extrait** les infos (nom, date, lieu, invités)
6. On **sauvegarde** dans `conventions.json`
7. L'**app mobile** lit ce fichier et affiche les conventions

C'est comme si vous visitiez manuellement chaque site, mais en automatique et en quelques secondes ! 🚀

---

## 🧪 Tester vous-même

```bash
# Lancer le scraper
npm run scrape

# Voir le résultat
cat data/conventions.json
```

Vous verrez exactement ce processus en action dans les logs !

---

**Questions ?** Consultez `SCRAPING-GUIDE.md` pour aller plus loin ! 🔥
