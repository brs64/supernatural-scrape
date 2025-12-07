# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer au Supernatural Conventions Tracker !

## Comment contribuer

### 🐛 Signaler un bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Créer une nouvelle issue avec :
   - Un titre clair et descriptif
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs actuel
   - Screenshots si possible
   - Votre environnement (OS, version Expo, etc.)

### ✨ Proposer une fonctionnalité

1. Créer une issue avec le tag `enhancement`
2. Décrire clairement :
   - Le problème que ça résout
   - Comment ça devrait fonctionner
   - Des exemples d'utilisation

### 🔧 Contribuer du code

#### 1. Fork et Clone

```bash
# Fork sur GitHub, puis :
git clone https://github.com/VOTRE_USERNAME/supernatural.git
cd supernatural
npm install
```

#### 2. Créer une branche

```bash
git checkout -b feature/ma-super-feature
# ou
git checkout -b fix/correction-bug
```

**Nommage des branches :**
- `feature/` : Nouvelle fonctionnalité
- `fix/` : Correction de bug
- `docs/` : Documentation
- `refactor/` : Refactoring
- `test/` : Tests

#### 3. Développer

```bash
# Lancer l'app en mode dev
npm start

# Tester les modifications
```

**Conventions de code :**

- Utiliser des noms de variables explicites en anglais
- Commenter le code complexe
- Suivre la structure existante
- Pas de `console.log()` en production (utiliser `__DEV__`)

**Style :**

```javascript
// ✅ Bon
const fetchConventions = async () => {
  try {
    const data = await ConventionsService.fetchConventions();
    setConventions(data);
  } catch (error) {
    console.error('Error fetching conventions:', error);
  }
};

// ❌ À éviter
const fc=async()=>{const d=await CS.fc();setC(d)}
```

#### 4. Commit

```bash
git add .
git commit -m "✨ Add feature: description courte"
```

**Format des commits :**

- ✨ `:sparkles:` Nouvelle fonctionnalité
- 🐛 `:bug:` Correction de bug
- 📝 `:memo:` Documentation
- 🎨 `:art:` Amélioration UI/UX
- ♻️ `:recycle:` Refactoring
- 🔥 `:fire:` Suppression de code
- ⚡ `:zap:` Performance
- 🚀 `:rocket:` Déploiement

Exemples :
```
✨ Add notification sound preference
🐛 Fix crash when loading empty conventions list
📝 Update README with build instructions
🎨 Improve convention card shadow effect
```

#### 5. Push et Pull Request

```bash
git push origin feature/ma-super-feature
```

Sur GitHub :
1. Créer une Pull Request
2. Décrire les changements
3. Lier les issues concernées (`Fixes #123`)
4. Attendre la review

**Template de PR :**

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment tester
1. Étape 1
2. Étape 2
3. ...

## Screenshots (si applicable)
[Ajouter des captures d'écran]

## Checklist
- [ ] Code testé localement
- [ ] Pas de console.log() restants
- [ ] Documentation mise à jour
- [ ] Commit messages clairs
```

## 🔍 Ajouter des sources de scraping

Pour ajouter un nouveau site à scraper :

1. Modifier `scraper/scrape.js`
2. Ajouter une nouvelle fonction `scrapeMonSite()`
3. Appeler cette fonction dans `main()`
4. Tester localement :

```bash
cd scraper
npm install
npm run scrape
# Vérifier data/conventions.json
```

5. Créer une PR avec :
   - Le code du scraper
   - Un exemple de résultat dans la description
   - Les limitations éventuelles

### Exemple de scraper

```javascript
async function scrapeMonSite() {
  try {
    console.log('🔍 Scraping Mon Site...');

    const response = await axios.get('URL_DU_SITE', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 ...'
      }
    });

    const $ = cheerio.load(response.data);

    // Adapter les sélecteurs CSS selon le site
    $('.event-card').each((i, elem) => {
      const name = $(elem).find('.event-title').text().trim();
      const location = $(elem).find('.location').text().trim();
      const date = $(elem).find('.date').text().trim();
      const url = $(elem).find('a').attr('href');

      // Filtrer si nécessaire
      if (name.toLowerCase().includes('supernatural')) {
        conventions.push({
          id: generateId(name, date),
          name,
          location,
          date,
          url: url.startsWith('http') ? url : `BASE_URL${url}`,
          source: 'Mon Site',
          guests: []
        });
      }
    });

    console.log(`✅ Mon Site: ${conventions.length} conventions`);
  } catch (error) {
    console.error('❌ Error scraping Mon Site:', error.message);
  }
}
```

## 🎨 Améliorer l'UI

Pour contribuer à l'interface :

1. Respecter le thème Supernatural :
   - Background : `#0D0D0D`
   - Primary : `#FF6600`
   - Accent : `#8B0000`

2. Tester sur iOS ET Android

3. Fournir des screenshots avant/après

4. S'assurer que c'est accessible (contraste, taille de texte)

## 🧪 Tests

Pour l'instant, pas de tests automatisés. Contributions bienvenues ! 🙏

Si vous voulez ajouter des tests :
- Jest pour la logique
- React Native Testing Library pour les composants
- Détox pour E2E (optionnel)

## 📝 Documentation

Toute amélioration de la documentation est appréciée :

- Corriger les fautes
- Ajouter des exemples
- Traduire (EN/FR)
- Améliorer les explications
- Ajouter des diagrammes

## ❓ Questions

Si vous avez des questions :

1. Consulter le [README.md](README.md)
2. Chercher dans les [Issues](../../issues)
3. Créer une nouvelle issue avec le tag `question`

## 🙏 Code de conduite

- Être respectueux et professionnel
- Accepter les critiques constructives
- Aider les autres contributeurs
- Pas de spam ou contenu inapproprié

---

**Merci pour votre contribution ! Carry on, hunters! 🔥**
