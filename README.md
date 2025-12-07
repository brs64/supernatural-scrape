# 🔥 Supernatural Conventions Tracker

Une application mobile iOS et Android pour tracker et recevoir des notifications sur les nouvelles conventions Supernatural en Europe.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-blue.svg)

## 📱 Fonctionnalités

- ✅ **Tracking automatique** des conventions Supernatural en Europe
- 🔔 **Notifications push** lors de l'ajout de nouvelles conventions
- 🎨 **UI thème Supernatural** (noir, rouge sang, orange feu)
- 🔄 **Rafraîchissement automatique** toutes les 30 minutes
- 💾 **Cache local** pour consultation hors ligne
- 🌍 **Sources multiples** : Creation Entertainment, Starfury, HonCon, Eventbrite
- 🆓 **100% gratuit** - Aucun serveur à payer !

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   📱 Application Mobile (React Native)  │
│   • iOS & Android                       │
│   • Notifications locales               │
│   • Cache AsyncStorage                  │
└─────────────┬───────────────────────────┘
              │ Fetch JSON
              ▼
┌─────────────────────────────────────────┐
│   📁 GitHub Repository (Public)         │
│   data/conventions.json                 │
└─────────────▲───────────────────────────┘
              │ Mise à jour
              │
┌─────────────┴───────────────────────────┐
│   🤖 GitHub Actions                     │
│   • Scraping toutes les heures          │
│   • Node.js + Cheerio + Axios           │
│   • Commit automatique si changements   │
└─────────────────────────────────────────┘
```

## 🚀 Installation et Configuration

### Prérequis

- Node.js 18+ installé
- Compte GitHub
- Expo Go app sur votre téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### 1️⃣ Configuration GitHub Actions

#### a) Créer un nouveau repository GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "🔥 Initial commit - Supernatural Conventions Tracker"

# Créer un repo sur GitHub et le lier
# Remplacer USERNAME et REPO_NAME par vos valeurs
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

#### b) Activer GitHub Actions

1. Aller dans votre repository sur GitHub
2. Cliquer sur l'onglet **Actions**
3. GitHub détectera automatiquement le workflow `scrape.yml`
4. Cliquer sur **"I understand my workflows, go ahead and enable them"**

#### c) Configurer les permissions

1. Aller dans **Settings** > **Actions** > **General**
2. Descendre à **Workflow permissions**
3. Sélectionner **"Read and write permissions"**
4. Cocher **"Allow GitHub Actions to create and approve pull requests"**
5. Cliquer sur **Save**

#### d) Tester le workflow manuellement

1. Aller dans **Actions** > **Scrape Supernatural Conventions**
2. Cliquer sur **"Run workflow"** > **"Run workflow"**
3. Le scraper va s'exécuter et mettre à jour `data/conventions.json`

### 2️⃣ Configuration de l'Application Mobile

#### a) Modifier l'URL dans le code

Ouvrir `src/services/ConventionsService.js` et remplacer :

```javascript
const CONVENTIONS_URL = 'https://raw.githubusercontent.com/VOTRE_USERNAME/supernatural-scraper/main/data/conventions.json';
```

Par votre URL réelle :

```javascript
const CONVENTIONS_URL = 'https://raw.githubusercontent.com/USERNAME/REPO_NAME/main/data/conventions.json';
```

#### b) Installer les dépendances

```bash
npm install
```

#### c) Lancer l'application

```bash
npm start
```

Scannez le QR code avec :
- **iOS** : Application Caméra native
- **Android** : Application Expo Go

## 📖 Utilisation

### Application Mobile

1. **Première ouverture** : L'app charge les conventions depuis GitHub
2. **Rafraîchir** : Tirez vers le bas pour rafraîchir manuellement
3. **Notifications** : Autorisez les notifications au premier lancement
4. **Ouvrir une convention** : Cliquez sur une carte pour ouvrir l'URL

### Ajouter des Sources de Scraping

Modifier `scraper/scrape.js` pour ajouter de nouveaux sites :

```javascript
async function scrapeMonNouveauSite() {
  try {
    console.log('🔍 Scraping Mon Site...');
    const response = await axios.get('https://monsite.com/conventions');
    const $ = cheerio.load(response.data);

    $('.convention').each((i, elem) => {
      const name = $(elem).find('.name').text().trim();
      const location = $(elem).find('.location').text().trim();
      const date = $(elem).find('.date').text().trim();
      const url = $(elem).find('a').attr('href');

      conventions.push({
        id: generateId(name, date),
        name,
        location,
        date,
        url,
        source: 'Mon Site',
        guests: []
      });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ajouter dans la fonction main()
async function main() {
  // ... code existant ...
  await scrapeMonNouveauSite(); // <-- Ajouter ici
  // ... code existant ...
}
```

### Ajouter des Conventions Manuellement

Dans `scraper/scrape.js`, fonction `addManualConventions()` :

```javascript
function addManualConventions() {
  const manualConventions = [
    {
      id: 'custom-convention-2025',
      name: 'Ma Convention Custom',
      location: 'Paris, France',
      date: 'December 25, 2025',
      url: 'https://example.com',
      source: 'Manual Entry',
      guests: ['Jensen Ackles', 'Jared Padalecki']
    }
  ];

  conventions.push(...manualConventions);
}
```

Ensuite, commit et push :

```bash
git add scraper/scrape.js
git commit -m "➕ Add new convention source"
git push
```

GitHub Actions se déclenchera automatiquement !

## 🎨 Personnalisation de l'UI

### Couleurs (dans les StyleSheets)

```javascript
const COLORS = {
  background: '#0D0D0D',      // Noir profond
  card: '#1A1A1A',            // Gris foncé
  primary: '#FF6600',         // Orange feu
  accent: '#8B0000',          // Rouge sang
  text: '#CCCCCC',            // Gris clair
  textSecondary: '#888888',   // Gris moyen
};
```

### Ajouter des Animations

Installer `react-native-reanimated` :

```bash
npx expo install react-native-reanimated
```

## 📊 Suivi des Actions GitHub

Voir les exécutions :
1. GitHub > **Actions**
2. Cliquer sur un workflow pour voir les logs
3. Voir le résumé avec le nombre de conventions trouvées

## 🐛 Dépannage

### L'app ne charge pas les conventions

1. Vérifier que l'URL dans `ConventionsService.js` est correcte
2. Tester l'URL dans un navigateur
3. Vérifier que le fichier `data/conventions.json` existe sur GitHub
4. Regarder les logs dans Expo : `npx expo start --clear`

### GitHub Actions ne se déclenche pas

1. Vérifier les permissions dans Settings > Actions > General
2. Vérifier le fichier workflow : `.github/workflows/scrape.yml`
3. Déclencher manuellement : Actions > Run workflow

### Les notifications ne fonctionnent pas

1. Vérifier les permissions dans les paramètres du téléphone
2. Sur iOS : Paramètres > App > Expo Go > Notifications
3. Sur Android : Paramètres > Apps > Expo Go > Notifications

### Le scraper ne trouve rien

1. Les sites peuvent avoir changé leur structure HTML
2. Vérifier les logs dans GitHub Actions
3. Adapter les sélecteurs CSS dans `scraper/scrape.js`
4. Ajouter des conventions manuelles en attendant

## 🛠️ Build de Production

### Android (APK)

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Configurer le build
eas build:configure

# Builder l'APK
eas build --platform android --profile preview
```

### iOS (IPA)

```bash
# Builder pour iOS (nécessite un compte Apple Developer)
eas build --platform ios
```

## 📝 Format du fichier JSON

```json
{
  "lastUpdate": "2025-12-07T15:00:00.000Z",
  "count": 2,
  "conventions": [
    {
      "id": "unique-id",
      "name": "Convention Name",
      "location": "City, Country",
      "date": "Month DD, YYYY",
      "url": "https://convention-url.com",
      "source": "Source Name",
      "guests": ["Guest 1", "Guest 2"]
    }
  ]
}
```

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📜 License

MIT License - Voir le fichier LICENSE

## 🙏 Crédits

- **Supernatural** : Série créée par Eric Kripke
- **Expo** : Framework React Native
- **GitHub Actions** : CI/CD gratuit

## 📞 Support

- GitHub Issues : Ouvrir une issue
- Documentation Expo : https://docs.expo.dev/

---

**Carry on, my wayward son! 🎸🔥**
